'use client';

import { motion } from 'framer-motion';

type Props = { currentIndex: number; total: number };

export function ProgressDots({ currentIndex, total }: Props) {
  return (
    <div className="flex shrink-0 justify-center gap-2 py-4" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{
            scale: i <= currentIndex ? 1.2 : 1,
            opacity: i <= currentIndex ? 1 : 0.4,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="h-2 w-2 rounded-full bg-brand-fill"
        />
      ))}
    </div>
  );
}
