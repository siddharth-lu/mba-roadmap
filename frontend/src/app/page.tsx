'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AppLogo } from './components/AppLogo';

export default function EntryPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');

  const handleGetStarted = () => {
    setShowForm(true);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!trimmedCity) {
      setError('Please enter your city.');
      return;
    }
    setError('');
    const params = new URLSearchParams();
    params.set('name', trimmedName);
    params.set('city', trimmedCity);
    params.set('state', trimmedState || 'N/A');
    router.push(`/select-spec?${params.toString()}`);
  };

  if (!showForm) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <AppLogo large className="mb-4" />
          <h1 className="text-2xl font-semibold text-zinc-900">MBA Roadmap</h1>
          <p className="mt-2 text-zinc-600">
            Create your personalized roadmap in a few steps.
          </p>
          <button
            type="button"
            onClick={handleGetStarted}
            className="mt-6 inline-block w-full rounded-xl bg-brand-fill px-4 py-3 text-center text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Get started
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Your details</h1>
        <p className="mt-2 text-zinc-600">
          Share a few details so we can personalize your roadmap.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-zinc-700">
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium text-zinc-700">
              State <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Maharashtra, California"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              autoComplete="address-level1"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-fill px-4 py-3 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
