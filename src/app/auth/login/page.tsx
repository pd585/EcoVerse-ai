import type { Metadata } from 'next';
import { AuthPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign in — EcoVerse AI',
  description: 'Begin your EcoVerse AI sustainability journey with a single tap.',
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
