import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Forgot password — EcoVerse AI',
  description: 'Reset your EcoVerse AI account password.',
};

export default function ForgotPasswordPage() {
  // Future: implement password reset flow with auth provider
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="glass max-w-md rounded-3xl px-8 py-12 text-center">
        <h1 className="text-2xl font-700">Reset your password</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to regain access.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full border border-input bg-card/40 px-4 py-3">
          <input
            type="email"
            placeholder="you@planet.earth"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button className="mt-4 w-full rounded-full bg-aurora px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--glow-emerald)] transition-transform hover:scale-[1.02]">
          Send reset link
        </button>
        <Link href={ROUTES.AUTH.LOGIN} className="mt-4 block text-xs text-muted-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
