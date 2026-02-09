'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@/lib/analytics';
import { MBA_PHASES, MIN_SWIPE_VIEW_MS } from './constants';
import type { RoadmapData } from './types';
import { ProgressDots } from './ProgressDots';

const getPhases = (roadmap: RoadmapData) =>
  roadmap.phases && roadmap.phases.length === 5 ? roadmap.phases : MBA_PHASES;
import { CtaBar } from './CtaBar';
import { PlacementCard } from './PlacementCard';
import { FullRoadmapTimeline } from './FullRoadmapTimeline';
import { AppLogo } from '../../components/AppLogo';

type TinderCardAPI = { restoreCard: () => Promise<void> };

type Props = { roadmap: RoadmapData; slug: string; demo?: boolean };

export function RoadmapView({ roadmap, slug, demo }: Props) {
  const searchParams = useSearchParams();
  const isCreator = searchParams.get('creator') === '1';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlacement, setShowPlacement] = useState(false);
  const phases = getPhases(roadmap);

  const tinderRef = useRef<TinderCardAPI | null>(null);
  const cardShownAtRef = useRef(0);

  useEffect(() => {
    cardShownAtRef.current = Date.now();
  }, [currentIndex]);

  const onCardLeftScreen = useCallback(() => {
    const elapsed = Date.now() - cardShownAtRef.current;
    if (elapsed < MIN_SWIPE_VIEW_MS) {
      tinderRef.current?.restoreCard();
      return;
    }

    setCurrentIndex((i) => {
      const phase = phases[i];
      track('swipe_completed', {
        phase_index: i,
        phase_name: phase?.subtitle ?? '',
        slug,
      });
      const next = i + 1;
      if (next >= phases.length) setShowPlacement(true);
      return next;
    });
  }, [slug, phases]);

  const isPlacementScreen = showPlacement && currentIndex >= phases.length;
  const canGoBack = currentIndex > 0 || isPlacementScreen;

  const goBack = useCallback(() => {
    if (isPlacementScreen) {
      setShowPlacement(false);
      setCurrentIndex(phases.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, isPlacementScreen, phases.length]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white">
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-5">
        <AppLogo compact />
      </div>
      {canGoBack && (
        <button
          type="button"
          onClick={goBack}
          className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg border-2 border-[var(--brand-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand-muted)] sm:right-6 sm:top-5"
          aria-label="Previous card"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
      {demo && (
        <div className="shrink-0 bg-[var(--brand-muted)] py-1.5 text-center text-xs font-medium text-[var(--brand)]">
          Demo mode — backend not running. Start it with <code className="rounded bg-[var(--brand-border)] px-1">npm run dev</code> from project root for real data.
        </div>
      )}
      <ProgressDots currentIndex={currentIndex} total={phases.length} />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-8 pl-16 sm:pl-4">
        <AnimatePresence mode="wait">
          {!isPlacementScreen && currentIndex < phases.length && (
            <motion.div
              key={currentIndex}
              className="absolute inset-4 flex items-center justify-center sm:inset-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TinderCard
                ref={tinderRef as React.Ref<TinderCardAPI>}
                onCardLeftScreen={onCardLeftScreen}
                preventSwipe={['up', 'down']}
                className="pressable h-full w-full max-w-md"
              >
                <motion.div
                  className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[var(--brand-border)] sm:ring-[var(--brand-border)]"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Accent bar */}
                  <div className="h-1 w-full bg-brand-fill" />
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div className="min-h-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[var(--brand-muted)] px-2 text-xs font-semibold text-[var(--brand)]">
                          {currentIndex + 1}
                        </span>
                        <p className="text-sm font-medium text-zinc-500">
                          {phases[currentIndex].title}
                        </p>
                      </div>
                      <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                        {phases[currentIndex].subtitle}
                      </h2>
                      <div className="mt-4 min-h-[8rem] overflow-y-auto pr-1">
                        <p className="text-[15px] leading-relaxed text-zinc-600 whitespace-pre-line">
                          {phases[currentIndex].description}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 shrink-0 text-center text-sm text-zinc-400">
                      Swipe left to continue →
                    </p>
                  </div>
                </motion.div>
              </TinderCard>
            </motion.div>
          )}

          {isPlacementScreen && (
            <motion.div
              key="placement"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex w-full max-w-md flex-col items-center gap-6 overflow-y-auto py-4"
            >
              <FullRoadmapTimeline phases={phases} />
              <PlacementCard roadmap={roadmap} slug={slug} isCreator={isCreator} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CtaBar slug={slug} completedSwipes={currentIndex} />
    </div>
  );
}
