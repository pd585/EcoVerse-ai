/**
 * AppShell layout wrapper for authenticated pages.
 * Provides persistent sidebar (desktop) and bottom nav (mobile).
 * @module components/layout/AppShell
 */

'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  FlaskConical,
  Map,
  LogOut,
  User,
} from 'lucide-react';
import { Brand } from './Brand';
import { EcoInsight } from './EcoInsight';
import { PlanetHealth } from './PlanetHealth';
import { RobotSeedlingIcon } from '@/components/brand';
import { EcosphereBackground } from '@/components/shared/EcosphereBackground';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { type PersonalityId } from '@/features/assessment/utils/personality';

const NAV = [
  { href: ROUTES.DASHBOARD.OVERVIEW, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.COACH.ROOT, label: 'AI Coach', icon: Sparkles },
  { href: ROUTES.SIMULATOR.ROOT, label: 'Simulator', icon: FlaskConical },
  { href: ROUTES.LEARN.ROOT, label: 'Learn Hub', icon: GraduationCap },
  { href: ROUTES.ROADMAP.ROOT, label: 'Roadmap', icon: Map },
  { href: ROUTES.PROFILE, label: 'Profile & Settings', icon: User },
] as const;

export interface AppShellProps {
  children: ReactNode;
  title: React.ReactNode;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const username = profile?.username || 'Green Guardian';
  const personality = (profile?.avatar_url as PersonalityId) || 'greenGuardian';

  return (
    <div className="relative min-h-dvh pt-3 sm:pt-4 lg:pt-5">
      <EcosphereBackground />
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-0.75rem)] w-full max-w-[min(1560px,calc(100vw-3rem))] flex-col sm:min-h-[calc(100dvh-1rem)] lg:min-h-[calc(100dvh-1.25rem)] lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="sticky top-3 hidden h-[calc(100dvh-0.75rem)] w-[264px] shrink-0 flex-col glass rounded-3xl border border-accent-cyan/12 bg-navy-deep/55 backdrop-blur-2xl sm:top-4 sm:h-[calc(100dvh-1rem)] lg:top-5 lg:flex lg:h-[calc(100dvh-1.25rem)] overflow-hidden">
          {/* Scrollable inner wrapper to preserve breathing space and prevent viewport overflow */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-7 px-4 flex flex-col gap-6" style={{ scrollBehavior: 'smooth' }}>
            {/* ── TOP ZONE: Brand + Nav + Info Cards ──────────────── */}
            <div className="shrink-0">
              <div className="px-1 pb-5 pt-1">
                <Brand />
              </div>
              <nav className="flex flex-col gap-1.5" aria-label="Primary navigation">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href.split('/').slice(0, 2).join('/'));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="group block outline-none"
                      aria-current={active ? 'page' : undefined}
                    >
                      <motion.div
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                          active
                            ? 'bg-gradient-to-r from-accent-emerald to-accent-cyan font-600'
                            : 'text-foreground/75 hover:bg-navy-mid/60 hover:text-foreground'
                        )}
                        style={{
                          color: active ? 'var(--nav-active-text, #020617)' : undefined,
                        }}
                        animate={{
                          scale: active ? 1.02 : 1,
                          boxShadow: active
                            ? 'var(--nav-active-shadow, 0 0 20px rgba(0, 245, 160, 0.25))'
                            : '0px 0px 0px rgba(0,0,0,0)'
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <Icon 
                           className="h-[18px] w-[18px] shrink-0 transition-colors duration-200" 
                          style={{
                            color: active ? 'var(--nav-active-text, #020617)' : 'currentColor'
                          }}
                          aria-hidden 
                        />
                        {label}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8">
                <div className="glass-soft rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <RobotSeedlingIcon size={28} animated={true} personality={personality} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground truncate">{username}</div>
                      <p className="text-xs text-muted-foreground">Level 4</p>
                    </div>
                  </div>
                </div>
                <PlanetHealth className="mt-4" />
                <EcoInsight className="mt-4" />
              </div>
            </div>

            {/* ── FLEXIBLE SPACER ────────────────────────────────── */}
            <div className="min-h-12 flex-1" />

            {/* ── BOTTOM ZONE: Sign Out + Version ─────────────────── */}
            <div className="shrink-0 mt-auto flex flex-col gap-2">
              {pathname === ROUTES.PROFILE && (
                <button
                  type="button"
                  onClick={signOut}
                  className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-rose-400/80 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden />
                  Sign Out
                </button>
              )}
              <div className="text-center text-[0.65rem] text-muted-foreground/80">
                EcoVerse v1.0
              </div>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-accent-cyan/12 bg-navy-deep/60 px-5 py-3 backdrop-blur-2xl lg:hidden">
            <Brand />
            <span className="glass-soft rounded-full px-3 py-1 text-xs font-semibold text-accent-emerald flex items-center gap-1">
              🌿 {username.split(' ')[0]}
            </span>
          </header>

          <div className="px-5 pb-28 pt-6 sm:px-8 lg:px-8 lg:pb-12 lg:pt-10">
            <PageHeader title={title} subtitle={subtitle} />
            {children}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-accent-cyan/12 bg-navy-deep/75 px-2 py-2 backdrop-blur-2xl lg:hidden"
        aria-label="Primary navigation"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href.split('/').slice(0, 2).join('/'));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[0.65rem] font-medium transition-colors',
                active ? 'text-accent-emerald font-600' : 'text-foreground/60',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label.split(' ')[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
