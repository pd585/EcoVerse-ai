/**
 * Authentication page component.
 * Overhauled to serve as a premium welcome portal with mascot interaction,
 * split 60/40 two-panel desktop structure, and visual brand continuity.
 *
 * @module features/auth/components/AuthPage
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import { EcosphereBackground } from '@/components/shared/EcosphereBackground';
import { RobotSeedlingIcon } from '@/components/brand';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { authService } from '../services/auth.service';
import { supabase } from '@/lib/supabase';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.9 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 9.8-4.1 9.8-9.9 0-.7 0-1.2-.2-1.7H12z"
      />
    </svg>
  );
}

export interface AuthPageProps {
  mode?: 'login' | 'register';
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [lookDirection, setLookDirection] = useState<'center' | 'left' | 'right' | 'fullname' | 'email' | 'password' | 'confirmPassword' | 'closed' | undefined>(undefined);
  const mascotLookDirection: 'center' | 'left' | 'right' | 'email' | 'password' | 'closed' | undefined =
    lookDirection === 'fullname' || lookDirection === 'confirmPassword' ? 'center' : lookDirection;
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isSuccess, setIsSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (authMode === 'register') {
      if (!validateRegisterForm()) {
        return;
      }
      setSubmitState('submitting');
      setLookDirection('closed');
      const { data, error } = await authService.signUp(email, password, fullName);
      if (error) {
        setFormErrors({ general: error.message });
        setSubmitState('idle');
        return;
      }
      setSubmitState('success');
      setIsSuccess(true);
      setTimeout(() => {
        router.push(ROUTES.ASSESSMENT.QUESTIONS);
      }, 900);
    } else {
      setSubmitState('submitting');
      setLookDirection('closed');
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        setFormErrors({ general: error.message });
        setSubmitState('idle');
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD.OVERVIEW);
      }, 550);
    }
  };

  const handleGoogleSSO = async () => {
    setSubmitState('submitting');
    setLookDirection('closed');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard/overview`,
        },
      });
      if (error) {
        setFormErrors({ general: error.message });
        setSubmitState('idle');
      }
    } catch (err: any) {
      setFormErrors({ general: err.message || 'An error occurred during Google Sign In.' });
      setSubmitState('idle');
    }
  };

  return (
    <div className="relative grid min-h-dvh grid-cols-1 lg:grid-cols-5 overflow-x-hidden">
      {/* Deterministic Ecosystem Background (Exactly One) */}
      <EcosphereBackground particleCount={16} />

      {/* LEFT PANEL: Mascot Visual Portal (60% Width on Desktop) */}
      <div className="relative hidden flex-col justify-between p-10 lg:flex lg:col-span-3 border-r border-white/5 bg-slate-950/20 backdrop-blur-sm overflow-hidden select-none">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes slow-orbit-tl {
            0%, 100% { transform: translate(-3px, -4px); }
            50% { transform: translate(3px, 4px); }
          }
          @keyframes slow-orbit-tr {
            0%, 100% { transform: translate(3px, -4px); }
            50% { transform: translate(-3px, 4px); }
          }
          @keyframes slow-orbit-bl {
            0%, 100% { transform: translate(-3px, 4px); }
            50% { transform: translate(3px, -4px); }
          }
          @keyframes slow-orbit-br {
            0%, 100% { transform: translate(3px, 4px); }
            50% { transform: translate(-3px, -4px); }
          }
          .animate-orbit-tl { animation: slow-orbit-tl 22s cubic-bezier(0.45,0,0.55,1) infinite; }
          .animate-orbit-tr { animation: slow-orbit-tr 26s cubic-bezier(0.45,0,0.55,1) infinite; }
          .animate-orbit-bl { animation: slow-orbit-bl 24s cubic-bezier(0.45,0,0.55,1) infinite; }
          .animate-orbit-br { animation: slow-orbit-br 28s cubic-bezier(0.45,0,0.55,1) infinite; }

          @keyframes connector-pulse {
            0%   { stroke-dashoffset: 0; opacity: 0.15; }
            50%  { stroke-dashoffset: -20; opacity: 0.45; }
            100% { stroke-dashoffset: -40; opacity: 0.15; }
          }
          .eco-connector-line {
            animation: connector-pulse 6s cubic-bezier(0.45,0,0.55,1) infinite;
          }
          .eco-connector-line-delay-1 { animation-delay: -1.5s; }
          .eco-connector-line-delay-2 { animation-delay: -3s; }
          .eco-connector-line-delay-3 { animation-delay: -4.5s; }

          @keyframes speech-float {
            0%, 100% { transform: translateY(0px); }
            50%      { transform: translateY(-4px); }
          }
          .animate-speech-float {
            animation: speech-float 8s cubic-bezier(0.45,0,0.55,1) infinite;
          }

          @keyframes chamber-ambient {
            0%, 100% { opacity: 0.12; }
            50%      { opacity: 0.22; }
          }
          .animate-chamber-ambient {
            animation: chamber-ambient 10s cubic-bezier(0.45,0,0.55,1) infinite;
          }
          .animate-chamber-ambient-alt {
            animation: chamber-ambient 12s cubic-bezier(0.45,0,0.55,1) infinite;
            animation-delay: -5s;
          }

          .eco-card-label {
            position: absolute;
            bottom: 8px;
            left: 10px;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 999px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(2,8,23,0.75);
            color: rgba(255,255,255,0.88);
            pointer-events: none;
          }
          .eco-connector-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: visible;
          }
        `}} />

        {/* 2x2 Ecosystem Scene Montage (Behind mascot, z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-100">

          {/* SVG Connector Lines — animated pulse from cards to mascot center */}
          <svg className="eco-connector-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="conn-tl" x1="27%" y1="22%" x2="50%" y2="50%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(0,245,160,0.35)" />
                <stop offset="100%" stopColor="rgba(0,245,160,0)" />
              </linearGradient>
              <linearGradient id="conn-tr" x1="73%" y1="22%" x2="50%" y2="50%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
              </linearGradient>
              <linearGradient id="conn-bl" x1="27%" y1="78%" x2="50%" y2="50%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(52,211,153,0.3)" />
                <stop offset="100%" stopColor="rgba(52,211,153,0)" />
              </linearGradient>
              <linearGradient id="conn-br" x1="73%" y1="78%" x2="50%" y2="50%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(94,234,212,0.3)" />
                <stop offset="100%" stopColor="rgba(94,234,212,0)" />
              </linearGradient>
              <filter id="conn-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* TL → center */}
            <line
              x1="calc(50% - 180px)"
              y1="calc(50% - 110px)"
              x2="50%"
              y2="50%"
              stroke="url(#conn-tl)"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              className="eco-connector-line"
              filter="url(#conn-glow)"
            />
            {/* TR → center */}
            <line
              x1="calc(50% + 180px)"
              y1="calc(50% - 110px)"
              x2="50%"
              y2="50%"
              stroke="url(#conn-tr)"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              className="eco-connector-line eco-connector-line-delay-1"
              filter="url(#conn-glow)"
            />
            {/* BL → center */}
            <line
              x1="calc(50% - 180px)"
              y1="calc(50% + 110px)"
              x2="50%"
              y2="50%"
              stroke="url(#conn-bl)"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              className="eco-connector-line eco-connector-line-delay-2"
              filter="url(#conn-glow)"
            />
            {/* BR → center */}
            <line
              x1="calc(50% + 180px)"
              y1="calc(50% + 110px)"
              x2="50%"
              y2="50%"
              stroke="url(#conn-br)"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              className="eco-connector-line eco-connector-line-delay-3"
              filter="url(#conn-glow)"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative grid w-[820px] grid-cols-2 grid-rows-2 gap-x-[180px] gap-y-12">
              {/* Top Left: Sustainable Living */}
              <div
                className="relative w-[320px] h-[190px] rounded-2xl overflow-hidden animate-orbit-tl justify-self-end"
                style={{
                  border: '1px solid rgba(0,245,160,0.18)',
                  boxShadow: '0 0 32px rgba(0,245,160,0.12), inset 0 1px 1px rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Image
                  src="/images/sustainable_living.webp"
                  alt="Sustainable Living"
                  fill
                  sizes="320px"
                  priority
                  className="object-cover"
                  style={{ opacity: 0.82, filter: 'blur(0px) saturate(1.15) brightness(0.88)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }} />
                <span className="eco-card-label" style={{ color: 'rgba(0,245,160,0.9)', borderColor: 'rgba(0,245,160,0.22)' }}>🌿 Sustainable Living</span>
              </div>

              {/* Top Right: Renewable Energy */}
              <div
                className="relative w-[320px] h-[190px] rounded-2xl overflow-hidden animate-orbit-tr justify-self-start"
                style={{
                  border: '1px solid rgba(34,211,238,0.18)',
                  boxShadow: '0 0 32px rgba(34,211,238,0.12), inset 0 1px 1px rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Image
                  src="/images/renewable_energy.webp"
                  alt="Renewable Energy"
                  fill
                  sizes="320px"
                  priority
                  className="object-cover"
                  style={{ opacity: 0.82, filter: 'blur(0px) saturate(1.15) brightness(0.88)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }} />
                <span className="eco-card-label" style={{ color: 'rgba(34,211,238,0.9)', borderColor: 'rgba(34,211,238,0.22)' }}>⚡ Renewable Energy</span>
              </div>

              {/* Bottom Left: Nature Recovery */}
              <div
                className="relative w-[320px] h-[190px] rounded-2xl overflow-hidden animate-orbit-bl justify-self-end"
                style={{
                  border: '1px solid rgba(52,211,153,0.18)',
                  boxShadow: '0 0 32px rgba(52,211,153,0.12), inset 0 1px 1px rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Image
                  src="/images/nature_recovery.webp"
                  alt="Nature Recovery"
                  fill
                  sizes="320px"
                  priority
                  className="object-cover"
                  style={{ opacity: 0.82, filter: 'blur(0px) saturate(1.15) brightness(0.88)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }} />
                <span className="eco-card-label" style={{ color: 'rgba(52,211,153,0.9)', borderColor: 'rgba(52,211,153,0.22)' }}>🌱 Nature Recovery</span>
              </div>

              {/* Bottom Right: Smart Transportation */}
              <div
                className="relative w-[320px] h-[190px] rounded-2xl overflow-hidden animate-orbit-br justify-self-start"
                style={{
                  border: '1px solid rgba(94,234,212,0.18)',
                  boxShadow: '0 0 32px rgba(94,234,212,0.12), inset 0 1px 1px rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Image
                  src="/images/smart_transportation.webp"
                  alt="Smart Transportation"
                  fill
                  sizes="320px"
                  priority
                  className="object-cover"
                  style={{ opacity: 0.82, filter: 'blur(0px) saturate(1.15) brightness(0.88)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }} />
                <span
                  className="eco-card-label"
                  style={{
                    color: 'rgba(94,234,212,0.95)',
                    borderColor: 'rgba(94,234,212,0.25)',
                    zIndex: 30,
                    bottom: '12px',
                    left: '12px'
                  }}
                >
                  🚆 Smart Mobility
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-slate-950/15 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_25px_50px_-12px_rgba(0,0,0,0.5)]",
                  lookDirection === 'email' && "shadow-[0_0_35px_rgba(34,211,238,0.25)] border-cyan-500/30",
                  lookDirection === 'password' && "shadow-[0_0_35px_rgba(0,245,160,0.25)] border-emerald-500/30",
                  isSuccess && "shadow-[0_0_45px_rgba(0,245,160,0.4)] border-emerald-400/35 scale-[1.03]"
                )}
              >
                {/* Companion Speech Bubble — floats above mascot and is absolutely positioned so it doesn't affect centering */}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "glass-soft rounded-2xl px-6 py-3 text-sm font-semibold text-accent-cyan border border-accent-cyan/15 absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+32px)] z-20 text-center shadow-[0_0_18px_rgba(34,211,238,0.1)] bg-slate-950/80 animate-speech-float whitespace-normal",
                    authMode === 'register' && 'max-w-[420px]'
                  )}
                  style={{ maxWidth: authMode === 'register' ? '420px' : '360px' }}
                >
                  {lookDirection === 'fullname' ? (
                    'Nice to meet you.'
                  ) : lookDirection === 'email' ? (
                    authMode === 'register'
                      ? 'Let\u2019s connect your ecosystem.'
                      : 'Checking your email entry…'
                  ) : lookDirection === 'password' ? (
                    authMode === 'register'
                      ? 'Protecting your future.'
                      : 'Safety check. Password field focused.'
                  ) : lookDirection === 'confirmPassword' ? (
                    'Almost ready to begin.'
                  ) : isSuccess ? (
                    'Ecosystem unlocked. Launching…'
                  ) : authMode === 'register' ? (
                    'Let\u2019s build your ecosystem.'
                  ) : (
                    'Ready to continue your sustainability journey?'
                  )}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-950 border-r border-b border-accent-cyan/15 rotate-45" />
                </motion.div>

                {/* Ambient Ecosystem Glow Reflections — breathing */}
                <div className={cn(
                  "absolute top-1 left-1 h-20 w-20 rounded-full blur-2xl pointer-events-none animate-chamber-ambient",
                  authMode === 'register' ? 'bg-accent-emerald/20' : 'bg-accent-emerald/12'
                )} />
                <div className={cn(
                  "absolute top-1 right-1 h-20 w-20 rounded-full blur-2xl pointer-events-none animate-chamber-ambient-alt",
                  authMode === 'register' ? 'bg-accent-cyan/20' : 'bg-accent-cyan/12'
                )} />
                <div className="absolute bottom-1 left-1 h-18 w-18 rounded-full bg-[#00F5A0]/10 blur-2xl pointer-events-none animate-chamber-ambient-alt" />
                <div className="absolute bottom-1 right-1 h-18 w-18 rounded-full bg-teal-400/8 blur-2xl pointer-events-none animate-chamber-ambient" />

                {/* Spinning decorative orbit rings */}
                <div className="absolute inset-3 rounded-full border border-dashed border-accent-cyan/8 animate-spin" style={{ animationDuration: '50s' }} />
                <div className="absolute inset-7 rounded-full border border-solid border-accent-emerald/8 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />

                <RobotSeedlingIcon
                  size={130}
                  animated={!isSuccess}
                  glow={true}
                  variant="hero"
                  lookDirection={mascotLookDirection}
                />

                {/* Chamber-level success ripple */}
                {isSuccess && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-accent-emerald bg-accent-emerald/10 pointer-events-none"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Brand header */}
        <div className="relative z-20">
          <Brand />
        </div>

        {/* Welcome Text Content — pushed down to clear bottom ecosystem cards */}
        <div className="relative z-20 text-center max-w-md mx-auto mt-14">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl font-800 tracking-tight text-white sm:text-3xl"
          >
            Everything is connected.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-sm text-emerald-50/70"
          >
            Continue building the future you started.
          </motion.p>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card (40% Width on Desktop) */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-10 lg:col-span-2 min-h-dvh">

        {/* Mobile Top Header (Mascot branding maintained on mobile screen) */}
        <div className="flex flex-col items-center text-center mb-6 lg:hidden select-none">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <div className="absolute inset-1 rounded-full border border-dashed border-accent-cyan/15 animate-spin" style={{ animationDuration: '25s' }} />
            <RobotSeedlingIcon size={38} animated={true} glow={true} variant="minimal" lookDirection={mascotLookDirection} />
          </div>
          <h2 className="text-xl font-800 text-white tracking-tight">Everything is connected.</h2>
          <p className="text-xs text-muted-foreground mt-1 px-4">Continue building the future you started.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={isSuccess ? { opacity: 0, y: -18, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass w-full max-w-md rounded-3xl p-8 sm:p-10 border border-white/10 bg-slate-950/45 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden"
        >
          {/* Subtle top horizontal highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent" />
          <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          {/* Form branding */}
          <div className="text-center mb-7 select-none">
            <h1 className="text-3xl font-800 text-white tracking-tight">
              EcoVerse <span className="text-gradient">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              {authMode === 'login'
                ? 'Sign in to continue your journey.'
                : 'Create your account to start your EcoVerse journey.'}
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-4">
            {authMode === 'register' && submitState !== 'success' ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Step 1 of 2</p>
                <p className="mt-2 text-sm font-semibold text-white">Create Your Account</p>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {authMode === 'register' && submitState === 'success' ? (
                <motion.div
                  key="register-success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Step 2 of 2</p>
                  <p className="mt-2 text-sm font-semibold text-white">Discover Your Sustainability Personality</p>
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-semibold text-emerald-300">✓ Account Created</p>
                    <p className="text-xl font-semibold text-white">🤖 Welcome to EcoVerse</p>
                    <p className="text-sm text-muted-foreground">Preparing your sustainability profile...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="space-y-4"
                  >
                    {authMode === 'register' && (
                      <motion.div
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="space-y-1"
                      >
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="auth-fullname">
                          Full Name
                        </label>
                        <div className="mt-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/40 px-4 py-3 transition-all">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden />
                          <input
                            id="auth-fullname"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setLookDirection('fullname')}
                            onBlur={() => setLookDirection(undefined)}
                            placeholder="Your full name"
                            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                          />
                        </div>
                        {formErrors.fullName && (
                          <p className="mt-2 text-xs text-rose-300">{formErrors.fullName}</p>
                        )}
                      </motion.div>
                    )}

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                      className="space-y-1"
                    >
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="auth-email">
                        Email Address
                      </label>
                      <div className="mt-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/40 px-4 py-3 focus-within:border-accent-cyan/50 focus-within:ring-1 focus-within:ring-accent-cyan/30 transition-all">
                        <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                        <input
                          id="auth-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setLookDirection('email')}
                          onBlur={() => setLookDirection(undefined)}
                          placeholder="you@planet.earth"
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-2 text-xs text-rose-300">{formErrors.email}</p>
                      )}
                    </motion.div>

                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="auth-password">
                          Password
                        </label>
                        {authMode === 'login' ? (
                          <Link
                            href={ROUTES.HOME}
                            className="text-xs text-muted-foreground hover:text-accent-cyan transition-colors underline-offset-4 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        ) : null}
                      </div>
                      <div className="mt-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/40 px-4 py-3 focus-within:border-accent-emerald/50 focus-within:ring-1 focus-within:ring-accent-emerald/30 transition-all">
                        <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
                        <input
                          id="auth-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setLookDirection('password')}
                          onBlur={() => setLookDirection(undefined)}
                          placeholder="••••••••"
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                      {formErrors.password && (
                        <p className="mt-2 text-xs text-rose-300">{formErrors.password}</p>
                      )}
                    </motion.div>

                    {authMode === 'register' && (
                      <motion.div
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="space-y-1"
                      >
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="auth-confirm-password">
                          Confirm Password
                        </label>
                        <div className="mt-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/40 px-4 py-3 transition-all">
                          <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
                          <input
                            id="auth-confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setLookDirection('confirmPassword')}
                            onBlur={() => setLookDirection(undefined)}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                          />
                        </div>
                        {formErrors.confirmPassword && (
                          <p className="mt-2 text-xs text-rose-300">{formErrors.confirmPassword}</p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                  {formErrors.general && (
                    <p className="mt-2 text-center text-xs text-rose-300 font-semibold">{formErrors.general}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState !== 'idle'}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-aurora px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-emerald)] transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authMode === 'login'
                      ? submitState === 'submitting'
                        ? 'Signing In…'
                        : 'Enter EcoVerse'
                      : submitState === 'submitting'
                        ? 'Creating Your Ecosystem...'
                        : submitState === 'success'
                          ? 'Ecosystem Created ✓'
                          : 'Create EcoVerse Account'}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>

                  <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground select-none">
                    <span className="h-px flex-1 bg-white/5" /> or <span className="h-px flex-1 bg-white/5" />
                  </div>

                  <button
                    type="button"
                    disabled={submitState === 'submitting'}
                    onClick={handleGoogleSSO}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-foreground border border-white/10 hover:bg-slate-900 transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <GoogleMark /> Continue with Google
                  </button>

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    {authMode === 'login' ? (
                      <>Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('register');
                            setFormErrors({});
                            setSubmitState('idle');
                            setIsSuccess(false);
                          }}
                          className="text-accent-cyan hover:underline underline-offset-4 font-semibold"
                        >
                          Create Account
                        </button>
                      </>
                    ) : (
                      <>Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setFormErrors({});
                            setSubmitState('idle');
                            setIsSuccess(false);
                          }}
                          className="text-accent-cyan hover:underline underline-offset-4 font-semibold"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Value and Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-[11px] text-muted-foreground/80 select-none">
            {authMode === 'register' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Discover Your Sustainability Personality
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Receive Personalized Recommendations
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Track Environmental Impact
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Build Your Future Ecosystem
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Personalized Sustainability Roadmaps
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> AI Environmental Coach
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Impact Tracking Dashboard
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-emerald text-xs font-bold">✓</span> Future Ecosystem Simulator
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Global Success Ripple Transition Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 15, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="h-32 w-32 rounded-full bg-gradient-to-tr from-[#00F5A0] to-[#22D3EE] blur-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
