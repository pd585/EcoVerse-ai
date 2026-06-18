import type { Metadata } from 'next';
import { AuthPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Create account — EcoVerse AI',
  description: 'Join EcoVerse AI and start your sustainability journey.',
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
