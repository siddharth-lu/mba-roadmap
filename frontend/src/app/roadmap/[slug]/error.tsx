'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RoadmapError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[RoadmapError]', error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white px-6">
      <h1 className="text-xl font-semibold text-zinc-900">Something went wrong</h1>
      <p className="max-w-sm text-center text-sm text-zinc-600">
        We couldn’t load this roadmap. It may be invalid or no longer available.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border-2 border-zinc-300 px-5 py-2.5 text-center text-sm font-medium text-zinc-900 hover:border-zinc-400"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
