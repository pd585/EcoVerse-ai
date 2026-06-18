import type { Metadata } from 'next';
import { QuestionWizard } from '@/features/assessment';

export const metadata: Metadata = {
  title: 'Your Carbon Assessment — EcoVerse AI',
  description: 'Five quick questions to personalize your EcoVerse journey.',
};

export default function AssessmentQuestionsPage() {
  return <QuestionWizard />;
}
