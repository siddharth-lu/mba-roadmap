'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';

const SPECIALIZATIONS = [
  'Marketing',
  'Finance',
  'HR',
  'Business Analytics',
  'Operations',
  'Product Management',
  'Entrepreneurship',
  'International Business',
  'Digital Business',
  'Strategy',
] as const;

export default function SelectSpecPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const name = searchParams.get('name') ?? '';
  const city = searchParams.get('city') ?? '';

  useEffect(() => {
    if (!name.trim() || !city.trim()) {
      router.replace('/');
    }
  }, [name, city, router]);

  const toggle = (spec: string) => {
    setSelected((prev) => {
      const next = prev.includes(spec)
        ? prev.filter((s) => s !== spec)
        : prev.length < 2
          ? [...prev, spec]
          : prev;
      track('specialization_selected', {
        specialization: spec,
        action: prev.includes(spec) ? 'remove' : 'add',
        selected_count: next.length,
        selected: next.join(','),
      });
      return next;
    });
  };

  const handleContinue = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('specializations', selected.join(','));
    router.push(`/select-goal?${params.toString()}`);
  };

  if (!name.trim() || !city.trim()) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-xl">
        <p className="mb-1 text-sm text-zinc-500">Hi, {name}</p>
        <h1 className="mb-1 text-xl font-semibold text-zinc-900 sm:text-2xl">
          Choose your specializations
        </h1>
        <p className="mb-6 text-sm text-zinc-600 sm:text-base">
          Select up to 2 areas you want to focus on.
        </p>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {SPECIALIZATIONS.map((spec) => {
            const isSelected = selected.includes(spec);
            return (
              <li key={spec}>
                <button
                  type="button"
                  onClick={() => toggle(spec)}
                  className={`w-full rounded-xl border-2 px-4 py-4 text-left text-sm font-medium transition-colors sm:py-5 sm:text-base ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                      : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
                  }`}
                >
                  {spec}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full rounded-xl bg-[var(--brand)] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)] disabled:bg-zinc-300 disabled:text-zinc-500 sm:py-4 sm:text-base"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
