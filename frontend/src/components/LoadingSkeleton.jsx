export default function LoadingSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-6 w-16 bg-slate-700 rounded-full" />
        <div className="h-4 w-12 bg-slate-700 rounded" />
      </div>

      <div className="h-5 w-full bg-slate-700 rounded mb-3" />
      <div className="h-5 w-5/6 bg-slate-700 rounded mb-5" />

      <div className="h-4 w-24 bg-slate-700 rounded" />
    </div>
  );
}