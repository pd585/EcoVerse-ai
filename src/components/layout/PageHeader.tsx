/**
 * PageHeader component.
 * Reusable header for all EcoVerse pages to ensure standardized typography, spacing and hierarchy.
 * @module components/layout/PageHeader
 */

'use client';

import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-700 tracking-tight sm:text-3xl hero-glow text-foreground font-display">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-muted-foreground font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
