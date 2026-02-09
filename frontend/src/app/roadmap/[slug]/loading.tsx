export default function RoadmapLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--brand-border)] border-t-[var(--brand)]" />
      <p className="text-sm text-zinc-600">Loading your roadmap…</p>
    </div>
  );
}
