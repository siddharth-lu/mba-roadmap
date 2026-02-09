'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RoadmapData } from './types';

type Props = {
  roadmap: RoadmapData;
  slug: string;
  isCreator: boolean;
};

export function PlacementCard({ roadmap, slug, isCreator }: Props) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/roadmap/${slug}`);
  }, [slug]);

  const copyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const whatsappUrl = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(`Check out my MBA roadmap: ${shareUrl}`)}`
    : '#';

  const location = [roadmap.city, roadmap.state && roadmap.state !== 'N/A' ? roadmap.state : null]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[var(--brand-border)] sm:p-8">
      <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Hi, {roadmap.name}</h2>
      {location && <p className="mt-1 text-sm text-zinc-500">{location}</p>}
      <div className="mt-5 space-y-3">
        <div className="rounded-lg bg-[var(--brand-muted)] p-3">
          <p className="text-xs font-medium text-zinc-500">Specializations</p>
          <p className="text-zinc-900">{roadmap.specializations?.join(', ') ?? '—'}</p>
        </div>
        <div className="rounded-lg bg-[var(--brand-muted)] p-3">
          <p className="text-xs font-medium text-zinc-500">Goal</p>
          <p className="text-zinc-900">{roadmap.goal}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={copyLink}
          disabled={!shareUrl}
          className="w-full rounded-xl border-2 border-[var(--brand-border)] bg-white py-3 text-sm font-medium text-[var(--brand)] transition-colors hover:border-[var(--brand)] disabled:opacity-50"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-xl bg-[#25D366] py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Share on WhatsApp
        </a>
        {!isCreator && (
          <a
            href="/"
            className="mt-2 block text-center text-sm font-medium text-zinc-600 underline hover:text-zinc-900"
          >
            Create My Own Roadmap
          </a>
        )}
      </div>
    </div>
  );
}
