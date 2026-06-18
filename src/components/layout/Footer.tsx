/**
 * Site-wide footer for public pages.
 * @module components/layout/Footer
 */

import { Brand } from './Brand';

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 px-5 py-10 text-center text-sm text-muted-foreground sm:px-8">
      <Brand className="justify-center" />
      <p className="mt-4">
        See the future your choices create. © {new Date().getFullYear()} EcoVerse AI.
      </p>
    </footer>
  );
}
