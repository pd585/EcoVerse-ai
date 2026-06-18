/**
 * Site-wide header for public pages (landing, auth).
 * @module components/layout/Header
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Brand } from './Brand';
import { ROUTES } from '@/constants/routes';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Brand />
        <nav className="flex items-center gap-2" aria-label="Primary">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-1.5 rounded-full bg-aurora px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--glow-emerald)] transition-transform hover:scale-105"
          >
            Start journey <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </nav>
      </div>
    </header>
  );
}
