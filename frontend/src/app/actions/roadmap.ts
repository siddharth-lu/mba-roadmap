'use server';

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5001';

type CreatePayload = {
  name: string;
  city: string;
  state: string;
  specializations: string[];
  goal: string;
  source: string;
};

type CreateResult =
  | { success: true; slug: string; roadmapId: string; demo?: boolean }
  | { success: false; error: string };

export async function createRoadmap(payload: CreatePayload): Promise<CreateResult> {
  try {
    const res = await fetch(`${BACKEND}/api/roadmap/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: (data as { error?: string }).error ?? 'Failed to create roadmap.' };
    }
    const slug = (data as { slug?: string }).slug;
    const roadmapId = (data as { roadmapId?: string }).roadmapId;
    if (!slug) {
      return { success: false, error: 'Invalid response from server.' };
    }
    return { success: true, slug, roadmapId: roadmapId ?? '' };
  } catch (err) {
    console.error('[createRoadmap]', err);
    return { success: true, slug: 'demo', roadmapId: 'demo', demo: true };
  }
}
