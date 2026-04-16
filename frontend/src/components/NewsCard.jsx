function getTimeAgo(dateString) {
  const now = new Date();
  const published = new Date(dateString);
  const diffHours = Math.floor((now - published) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function NewsCard({ article }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase bg-blue-600 px-2 py-1 rounded-full">
          {article.sector}
        </span>

        <span className="text-xs text-slate-400">
          {getTimeAgo(article.published_at)}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-3 leading-snug">
        {article.headline}
      </h3>

      <p className="text-sm text-slate-400">
        {article.source}
      </p>
    </div>
  );
}