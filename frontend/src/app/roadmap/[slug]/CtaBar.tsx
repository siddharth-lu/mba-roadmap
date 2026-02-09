'use client';

import { useCallback } from 'react';
import { track } from '@/lib/analytics';
import { MIN_SWIPES_FOR_CTA_HIGHLIGHT } from './constants';

type Props = {
  slug: string;
  completedSwipes: number;
};

export function CtaBar({ slug, completedSwipes }: Props) {
  const highlighted = completedSwipes >= MIN_SWIPES_FOR_CTA_HIGHLIGHT;

  const handleClick = useCallback(
    (label: string) => {
      track('cta_clicked', { cta_label: label, slug });
    },
    [slug]
  );

  return (
    <div
      className={`shrink-0 border-t border-[var(--brand-border)] bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-shadow duration-300 ${
        highlighted ? 'ring-t-2 ring-[var(--brand)] ring-inset' : ''
      }`}
    >
      <div className="mx-auto flex max-w-md gap-3">
        <button
          type="button"
          onClick={() => handleClick('Talk to MBA Counselor')}
          className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
            highlighted
              ? 'border-2 border-[var(--brand)] bg-[var(--brand-muted)] text-[var(--brand)] hover:bg-[var(--brand-border)]'
              : 'border-2 border-zinc-300 text-zinc-700 hover:border-zinc-400'
          }`}
        >
          Talk to MBA Counselor
        </button>
        <button
          type="button"
          onClick={() => handleClick('Apply Now')}
          className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition-colors bg-brand-fill hover:bg-[var(--brand-hover)]"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
