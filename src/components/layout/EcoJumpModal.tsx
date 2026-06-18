/**
 * EcoJump coming-soon modal — premium teaser for the sustainability game.
 * Uses existing Radix Dialog modal system + EcoVerse mascot.
 * @module components/layout/EcoJumpModal
 */

'use client';

import { type ComponentProps } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/Modal';
import { RobotSeedlingIcon } from '@/components/brand';
import type { RobotSeedlingIconProps } from '@/components/brand';

type Personality = NonNullable<RobotSeedlingIconProps['personality']>;

export interface EcoJumpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personality?: Personality;
}

export function EcoJumpModal({
  open,
  onOpenChange,
  personality = 'greenGuardian',
}: EcoJumpModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="max-w-md border-accent-cyan/15 text-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(0, 229, 255, 0.08) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 50% 80%, rgba(0, 245, 160, 0.06) 0%, transparent 50%), ' +
            'rgba(8, 28, 46, 0.92)',
        }}
      >
        {/* ── Hero mascot ──────────────────────────────────────────── */}
        <div className="mx-auto mb-5 flex items-center justify-center">
          <div className="relative">
            {/* Ambient glow ring behind mascot */}
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, rgba(0, 245, 160, 0.12) 50%, transparent 70%)',
                transform: 'scale(1.8)',
              }}
              aria-hidden
            />
            <RobotSeedlingIcon
              size={100}
              variant="hero"
              animated
              glow
              personality={personality}
            />
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <ModalHeader className="items-center text-center">
          <ModalTitle className="text-gradient text-2xl">
            <span className="bg-none bg-clip-border text-foreground" style={{ WebkitTextFillColor: 'unset' }}>🎮</span> EcoJump
          </ModalTitle>
          <ModalDescription className="mt-1 text-base font-600 text-foreground/90">
            Save The Planet
          </ModalDescription>
        </ModalHeader>

        <div className="mt-5 space-y-4">
          <p className="text-sm leading-relaxed text-foreground/70">
            Catch Green.
            <br />
            Avoid Carbon.
          </p>

          {/* Coming soon badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent-emerald/20 bg-accent-emerald/8 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
            <span className="text-xs font-600 text-accent-emerald">
              Coming Soon
            </span>
          </div>

          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

          <p className="text-xs leading-relaxed text-muted-foreground/80">
            Coming in the next EcoVerse update.
            <br />
            Your Guardian is preparing the mission.
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}
