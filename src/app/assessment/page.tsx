import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Assessment — EcoVerse AI',
};

export default function AssessmentRootPage() {
  redirect(ROUTES.ASSESSMENT.QUESTIONS);
}
