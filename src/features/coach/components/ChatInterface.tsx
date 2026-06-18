/**
 * AI Coach chat interface component.
 * @module features/coach/components/ChatInterface
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { RobotSeedlingIcon } from '@/components/brand';
import { useAuth } from '@/components/layout/AuthProvider';
import { coachService } from '../services/coach.service';
import { supabase } from '@/lib/supabase';
import { COACH_FALLBACKS } from '@/data/daily-data';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

type Msg = { from: 'ai' | 'me'; text: string };

const SUGGESTIONS = [
  'How do I cut my transport emissions?',
  'Is switching to solar worth it for me?',
  'Explain carbon offsets simply',
  'Give me one easy win this week',
];

function generateReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('transport') || q.includes('commut') || q.includes('car'))
    return 'Transport is your biggest slice at 34%. The highest-leverage move: replace two car commutes a week with transit or cycling — that\'s roughly −0.4t/yr with almost no cost. Want me to add it to your roadmap?';
  if (q.includes('solar') || q.includes('energy'))
    return 'For your home, a green tariff is the fastest win (−1.1t/yr, often same price). Solar pays off over ~7 years and could cover most of your electricity. Run the Simulator\'s solar scenario to see your numbers come alive. ☀️';
  if (q.includes('offset'))
    return 'Think of offsets as a backstop, not a substitute: first reduce what you can, then fund verified projects (reforestation, renewables) for the rest. Aim to offset only your hard-to-cut emissions.';
  if (q.includes('win') || q.includes('easy'))
    return 'Easiest win this week: switch to a renewable energy plan. Five minutes, no lifestyle change, and it\'s your single biggest reduction. Shall I pin it as today\'s task? 🌱';
  return 'Every action counts. Swapping commutes, auditing household appliances, and reducing red meat in your diet are all excellent starting points. What sector are you focusing on first?';
}

export function ChatInterface() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'ai',
      text: 'Hi Guardian 🌿 I\'m your EcoVerse coach. I\'m here to help — never to judge. Ask me anything about your footprint, or tap a starter below.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const localHistoryKey = `ecoverse_coach_history_${user.id}`;

    coachService.getHistory(user.id).then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const mappedMsgs = (data as any[]).map((msg) => ({
          from: msg.role === 'user' ? ('me' as const) : ('ai' as const),
          text: msg.message,
        }));
        setMsgs(mappedMsgs);
        safeSetStorageItem(localHistoryKey, mappedMsgs);
      } else {
        // Fallback to local storage if DB is empty or fails
        const cachedHistory = safeGetStorageItem<Msg[]>(localHistoryKey, []);
        if (cachedHistory.length > 0) {
          setMsgs(cachedHistory);
        }
      }
      setLoading(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'auto' }), 50);
    });
  }, [user]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || !user || loading) return;

    const localHistoryKey = `ecoverse_coach_history_${user.id}`;

    // Optimistically update local message state and clear input
    let currentMsgs: Msg[] = [];
    setMsgs((prev) => {
      currentMsgs = [...prev, { from: 'me' as const, text: t }];
      safeSetStorageItem(localHistoryKey, currentMsgs);
      return currentMsgs;
    });

    setInput('');
    setTyping(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      // 1. Save user's message to Supabase
      await coachService.saveMessage(user.id, 'user', t).catch(() => {});

      // Get auth session token
      const sessionResponse = await supabase.auth.getSession();
      const token = sessionResponse.data.session?.access_token;

      // 2. Call server proxy to generate reply
      const invalidateCache = safeGetStorageItem('ecoverse_cache_dirty', false);
      const apiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          feature: 'coach',
          message: t,
          invalidateCache,
        }),
      });

      let reply = '';
      let isSuccess = false;

      if (apiResponse.ok) {
        const aiData = await apiResponse.json();
        const content = aiData.content || '';
        // Validate it is a real response and not the heavy load fallback
        if (content && !content.includes('heavy load') && aiData.model !== 'graceful-fallback-response') {
          reply = content;
          isSuccess = true;
          if (invalidateCache) {
            try { localStorage.removeItem('ecoverse_cache_dirty'); } catch (_) {}
          }
        }
      }

      if (!isSuccess) {
        // Fallback priority:
        // 1. Previous conversation cache
        // 2. Curated coach fallback dataset
        const parsedHistory = safeGetStorageItem<Msg[]>(localHistoryKey, []);
        
        // Filter out 'me' messages and get assistant replies
        const assistantReplies = parsedHistory
          .filter(m => m.from === 'ai')
          .map(m => m.text);

        if (assistantReplies.length > 0) {
          const lastReply = assistantReplies[assistantReplies.length - 1];
          if (lastReply) {
            const firstSentence = lastReply.split(/[.!?]/)[0];
            reply = `${firstSentence}. Let's continue focusing on sustainable choices. What other habits or goals would you like to discuss?`;
          }
        }

        if (!reply) {
          const randomFallback = COACH_FALLBACKS[Math.floor(Math.random() * COACH_FALLBACKS.length)];
          reply = randomFallback;
        }
      }

      // 3. Save AI reply to Supabase
      await coachService.saveMessage(user.id, 'coach', reply).catch(() => {});

      // 4. Update state and local storage cache
      setMsgs((prev) => {
        const updated = [...prev, { from: 'ai' as const, text: reply }];
        safeSetStorageItem(localHistoryKey, updated);
        return updated;
      });
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      console.error('Failed to log message to database:', err);
      // Keep existing conversation visible, do not wipe chat history
      setTyping(false);
    }
  };

  return (
    <AppShell
      title="AI Coach"
      subtitle="Your sustainability companion — friendly, intelligent, always in your corner."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Companion Diagnostics Panel */}
        <div className="glass-premium flex flex-col justify-between rounded-3xl p-6 lg:h-[68dvh]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00F5A0]">
              <RobotSeedlingIcon size={16} animated={true} /> GUARDIAN NODE ACTIVE
            </div>
            <h3 className="mt-4 text-xl font-700">Ecosystem Companion</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Analyzing your carbon footprint profiles. Transportation currently represents your highest leverage reduction sector at 34%.
            </p>

            <div className="mt-6 space-y-4">
              <div className="glass-soft rounded-2xl p-4 border border-accent-cyan/10">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Companion Status</div>
                <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#00F5A0] animate-pulse" /> Calibrated & Online
                </div>
              </div>

              <div className="glass-soft rounded-2xl p-4 border border-accent-cyan/10">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Focus Sector</div>
                <div className="mt-1.5 text-sm font-semibold text-[#00E5FF]">
                  Transportation (34%)
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Targeting −0.4t CO₂e/yr savings via multi-mode transit strategies.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border/40 pt-4 text-[10px] text-muted-foreground leading-relaxed">
            Calibrations adjust dynamically as you complete milestones on your Roadmap.
          </div>
        </div>

        {/* Dialog System */}
        <div className="glass-premium flex h-[68dvh] flex-col overflow-hidden rounded-3xl lg:col-span-2">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-aurora/10 border border-accent-cyan/15">
              <RobotSeedlingIcon size={26} animated={true} />
            </span>
            <div>
              <div className="font-700">EcoVerse Guide</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#00F5A0] animate-pulse" /> Online · personalized to you
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'} items-start gap-2.5`}
              >
                {m.from === 'ai' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy-mid/40 border border-accent-cyan/15 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    <RobotSeedlingIcon size={20} animated={false} glow={true} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.from === 'me'
                      ? 'bg-gradient-to-r from-accent-emerald to-accent-cyan text-deepspace font-500 shadow-[0_0_15px_rgba(0,245,160,0.15)]'
                      : 'glass-soft text-foreground border border-accent-cyan/5'
                  }`}
                >
                  {m.text ? m.text.replace(/<[^>]*>/g, '') : ''}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex justify-start items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy-mid/40 border border-accent-cyan/15 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  <RobotSeedlingIcon size={20} animated={true} glow={true} />
                </div>
                <div className="glass-soft flex gap-1 rounded-2xl px-4 py-3.5 border border-accent-cyan/5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-2 w-2 animate-pulse-glow rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${d * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestion chips */}
          {!loading && msgs.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="glass-soft rounded-full px-3.5 py-2 text-xs font-medium transition-transform hover:scale-105 border border-accent-cyan/5"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach anything…"
              aria-label="Message the coach"
              className="flex-1 rounded-full border border-input bg-card/40 px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-aurora text-primary-foreground transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
