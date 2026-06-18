'use client';

import dynamic from 'next/dynamic';

const ChatInterface = dynamic(
  () => import('@/features/coach').then((mod) => mod.ChatInterface),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading AI Coach...
      </div>
    ),
  }
);

export default function CoachClient() {
  return <ChatInterface />;
}
