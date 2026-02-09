import Link from 'next/link';

export default function RoadmapNotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white px-6">
      <h1 className="text-xl font-semibold text-zinc-900">Roadmap not found</h1>
      <p className="max-w-sm text-center text-sm text-zinc-600">
        This roadmap doesn’t exist or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
      >
        Create your own roadmap
      </Link>
    </div>
  );
}
