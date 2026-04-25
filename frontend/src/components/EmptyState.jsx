export default function EmptyState({ sector }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
      <p className="text-slate-400 text-sm">
        No news found for{" "}
        <span className="capitalize text-white font-medium">
          {sector}
        </span>
      </p>
    </div>
  );
}