import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/layout/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoVerse AI — See the Future Your Choices Create',
  description:
    'EcoVerse AI helps you visualize, simulate, and reduce your carbon footprint through immersive storytelling and AI-powered sustainability guidance.',
  authors: [{ name: 'EcoVerse AI' }],
  openGraph: {
    title: 'EcoVerse AI — See the Future Your Choices Create',
    description:
      'An immersive sustainability journey. Understand, simulate, and shrink your carbon footprint with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EcoVerseAI',
  },
  icons: {
    icon: '/brand/favicon.svg',
    shortcut: '/brand/favicon.svg',
    apple: '/brand/ecoverse-app-icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1020',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
