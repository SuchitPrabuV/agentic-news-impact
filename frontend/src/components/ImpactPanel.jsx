export default function ImpactPanel({ article, prediction, onClose }) {
  if (!article) return null;

  if (!prediction || prediction.impact_level === "Loading") {
    return (
        <div
        className="fixed inset-0 z-50 flex justify-end bg-black/50"
        onClick={onClose}
        >
        <div className="w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
            <div>
                <p className="text-sm uppercase text-blue-400 mb-2">
                {article.sector}
                </p>

                <h2 className="text-2xl font-bold leading-tight">
                {article.headline}
                </h2>
            </div>

            <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl ml-4"
            >
                ×
            </button>
            </div>

            <div className="space-y-6 animate-pulse">
            <div className="h-8 w-28 bg-slate-800 rounded-full" />
            <div className="space-y-3">
                <div className="h-5 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-800 rounded" />
            </div>
            <div className="space-y-3">
                <div className="h-5 w-40 bg-slate-800 rounded" />
                <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-800 rounded-full" />
                <div className="h-8 w-24 bg-slate-800 rounded-full" />
                <div className="h-8 w-16 bg-slate-800 rounded-full" />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm uppercase text-blue-400 mb-2">
              {article.sector}
            </p>

            <h2 className="text-2xl font-bold leading-tight">
              {article.headline}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl ml-4"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        {prediction && (
          <>
            {/* Impact Level */}
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  prediction.impact_level === "High"
                    ? "bg-red-600/20 text-red-400"
                    : prediction.impact_level === "Medium"
                    ? "bg-yellow-600/20 text-yellow-400"
                    : "bg-green-600/20 text-green-400"
                }`}
              >
                {prediction.impact_level} Impact
              </span>
            </div>

            {/* Summary */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-slate-300 leading-7">
                {prediction.summary}
              </p>
            </section>

            {/* Affected Entities */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Affected Entities
              </h3>

              <div className="flex flex-wrap gap-2">
                {prediction.affected_entities?.map((entity) => (
                  <span
                    key={entity}
                    className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-200"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </section>

            {/* Short-Term Impact */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Short-Term Impact
              </h3>
              <p className="text-slate-300 leading-7">
                {prediction.short_term_impact}
              </p>
            </section>

            {/* Long-Term Impact */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Long-Term Impact
              </h3>
              <p className="text-slate-300 leading-7">
                {prediction.long_term_impact}
              </p>
            </section>

            {/* Sector Impact */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Sector Impact
              </h3>
              <p className="text-slate-300 leading-7">
                {prediction.sector_impact}
              </p>
            </section>

            {/* Confidence Score */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  Confidence Score
                </h3>

                <span className="text-sm text-slate-300">
                  {prediction.confidence_score}%
                </span>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${prediction.confidence_score}%`,
                  }}
                />
              </div>
            </section>

            {/* Tags */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>

              <div className="flex flex-wrap gap-2">
                {prediction.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}