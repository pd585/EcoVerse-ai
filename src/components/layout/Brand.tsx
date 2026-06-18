/**
 * EcoVerse AI brand logo component.
 * Renders the robot seedling mascot + wordmark used in headers and sidebars.
 * @module components/layout/Brand
 */

import Link from 'next/link';
import { RobotSeedlingLogo } from '@/components/brand/RobotSeedlingLogo';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export interface BrandProps {
  /** Link destination — defaults to home */
  href?: string;
  className?: string;
}

export function Brand({ href = ROUTES.HOME, className }: BrandProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="EcoVerse AI home"
    >
      <RobotSeedlingLogo className="transition-transform group-hover:scale-[1.03]" />
    </Link>
  );
}
