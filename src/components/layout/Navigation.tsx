/**
 * Standalone Navigation component for use in non-AppShell contexts.
 * @module components/layout/Navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  FlaskConical,
  Map,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD.OVERVIEW, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.COACH.ROOT, label: 'AI Coach', icon: Sparkles },
  { href: ROUTES.SIMULATOR.ROOT, label: 'Simulator', icon: FlaskConical },
  { href: ROUTES.LEARN.ROOT, label: 'Learn Hub', icon: GraduationCap },
  { href: ROUTES.ROADMAP.ROOT, label: 'Roadmap', icon: Map },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href.split('/').slice(0, 2).join('/'));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
              active
                ? 'bg-aurora text-primary-foreground shadow-[var(--glow-emerald)]'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
