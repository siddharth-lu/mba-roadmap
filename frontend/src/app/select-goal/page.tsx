'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { createRoadmap } from '@/app/actions/roadmap';

const GOALS = [
  'High Package Placement',
  'Career Switch',
  'Leadership Growth',
  'Start a Business',
  "I'm Confused",
] as const;

export default function SelectGoalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGoal, setLastGoal] = useState<string | null>(null);

  const name = searchParams.get('name') ?? '';
  const city = searchParams.get('city') ?? '';
  const state = searchParams.get('state') ?? 'N/A';
  const specializationsParam = searchParams.get('specializations') ?? '';
  const specializations = specializationsParam ? specializationsParam.split(',').map((s) => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    if (!name.trim() || !city.trim()) {
      router.replace('/');
    }
  }, [name, city, router]);

  const handleSelect = async (goal: string) => {
    setError(null);
    setLastGoal(goal);
    setSubmitting(true);
    track('goal_selected', { goal });
    const result = await createRoadmap({
      name: name.trim() || 'Guest',
      city: city.trim() || 'Unknown',
      state: state.trim() || 'N/A',
      specializations: specializations.length ? specializations : ['General'],
      goal,
      source: 'web',
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    track('roadmap_generated', {
      slug: result.slug,
      roadmap_id: result.roadmapId,
      goal,
      specializations: specializations.join(','),
    });
    router.push(`/roadmap/${result.slug}?creator=1`);
  };

  if (!name.trim() || !city.trim()) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-xl">
        <p className="mb-1 text-sm text-zinc-500">Hi, {name} · {city}</p>
        <h1 className="mb-1 text-xl font-semibold text-zinc-900 sm:text-2xl">
          What&apos;s your career goal?
        </h1>
        <p className="mb-6 text-sm text-zinc-600 sm:text-base">
          Choose one — we&apos;ll create your roadmap.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2" role="alert">
            <p className="text-sm text-red-700">{error}</p>
            <p className="mt-1 text-xs text-red-600">
              From the project root run: <code className="rounded bg-red-100 px-1">npm run dev</code> to start both frontend and backend.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-sm font-medium text-red-700 underline hover:no-underline"
              >
                Dismiss
              </button>
              {lastGoal && (
                <button
                  type="button"
                  onClick={() => handleSelect(lastGoal)}
                  className="text-sm font-medium text-red-700 underline hover:no-underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 gap-3 sm:gap-4">
          {GOALS.map((goal) => (
            <li key={goal}>
              <button
                type="button"
                onClick={() => handleSelect(goal)}
                disabled={submitting}
                className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-4 text-left text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 disabled:opacity-60 sm:py-5 sm:text-base"
              >
                {goal}
              </button>
            </li>
          ))}
        </ul>

        {submitting && (
          <p className="mt-6 text-center text-sm text-zinc-500">Creating your roadmap…</p>
        )}
      </div>
    </main>
  );
}
