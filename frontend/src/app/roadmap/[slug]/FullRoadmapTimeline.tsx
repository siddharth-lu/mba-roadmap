'use client';

import type { Phase } from './types';
import { AVG_PACKAGE_LABEL } from './constants';

type Props = { phases: Phase[] };

export function FullRoadmapTimeline({ phases }: Props) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-center text-lg font-semibold text-zinc-900">Your MBA roadmap</h2>
      <p className="mt-1 text-center text-sm text-zinc-500">Start → Placement outcome</p>
      <div className="mt-6 flex">
        {/* Vertical line */}
        <div className="relative flex w-8 shrink-0 flex-col items-center">
          <div className="absolute top-0 bottom-0 w-0.5 bg-[var(--brand)]" />
          {/* Nodes */}
          <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand)] bg-white ring-2 ring-[var(--brand-muted)]" title="Start" />
          {phases.map((_, i) => (
            <div
              key={i}
              className="relative z-10 mt-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand)] bg-white ring-2 ring-[var(--brand-muted)]"
            />
          ))}
          <div
            className="relative z-10 mt-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand)] bg-[var(--brand-muted)] ring-2 ring-[var(--brand-muted)]"
            title="Outcome"
          />
        </div>
        {/* Labels */}
        <div className="ml-2 flex flex-1 flex-col pb-1">
          <div className="min-h-[1.25rem] text-sm font-medium text-zinc-600">0 — Start</div>
          {phases.map((p, i) => (
            <div key={i} className="mt-4 min-h-[1.25rem] text-sm font-medium text-zinc-800">
              {i + 1} — {p.subtitle}
            </div>
          ))}
          <div className="mt-4 text-sm font-semibold text-[var(--brand)]">
            {phases.length + 1} — Avg. package: {AVG_PACKAGE_LABEL}
          </div>
        </div>
      </div>
    </div>
  );
}
