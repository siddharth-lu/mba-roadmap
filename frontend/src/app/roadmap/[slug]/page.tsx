import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RoadmapView } from './RoadmapView';

const API_BASE =
  typeof process.env.NEXT_PUBLIC_API_URL === 'string' && process.env.NEXT_PUBLIC_API_URL.trim()
    ? process.env.NEXT_PUBLIC_API_URL.trim()
    : 'http://localhost:5001';

function isValidSlug(slug: string): boolean {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 200;
}

type Props = { params: Promise<{ slug: string }> };

const DEMO_ROADMAP = {
  name: 'Guest',
  city: 'Demo',
  state: 'N/A',
  specializations: ['Marketing', 'Strategy'],
  goal: 'High Package Placement',
  slug: 'demo',
};

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  if (slug === 'demo') {
    return (
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white">Loading…</div>}>
        <RoadmapView roadmap={DEMO_ROADMAP} slug="demo" demo />
      </Suspense>
    );
  }

  try {
    const res = await fetch(`${API_BASE}/api/roadmap/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) notFound();
    const roadmap = await res.json();
    if (!roadmap?.slug) notFound();
    return (
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white">Loading…</div>}>
        <RoadmapView roadmap={roadmap} slug={slug} />
      </Suspense>
    );
  } catch {
    notFound();
  }
}
