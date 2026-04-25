export default function ImpactPanel({ article, prediction, error, onClose }) {
  if (!article) return null;

  const isLoading = !prediction || prediction.impact_level === "Loading";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 sm:w-[90%] lg:w-[700px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-2 text-sm uppercase text-blue-400">{article.sector}</p>
            <h2 className="text-2xl font-bold leading-tight">{article.headline}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-2xl text-slate-400 hover:text-white"
            aria-label="Close panel"
          >
            x
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-8 w-28 rounded-full bg-slate-800" />
            <div className="space-y-3">
              <div className="h-5 w-32 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-800" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-slate-800" />
              <div className="flex gap-2">
                <div className="h-8 w-20 rounded-full bg-slate-800" />
                <div className="h-8 w-24 rounded-full bg-slate-800" />
                <div className="h-8 w-16 rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
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

            <section className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Summary</h3>
              <p className="leading-7 text-slate-300">{prediction.summary}</p>
            </section>

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">Affected Entities</h3>
              <div className="flex flex-wrap gap-2">
                {prediction.affected_entities?.length > 0 ? (
                  prediction.affected_entities.map((entity) => (
                    <span
                      key={entity}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200"
                    >
                      {entity}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No entities were identified.</p>
                )}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Short-Term Impact</h3>
              <p className="leading-7 text-slate-300">{prediction.short_term_impact}</p>
            </section>

            <section className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Long-Term Impact</h3>
              <p className="leading-7 text-slate-300">{prediction.long_term_impact}</p>
            </section>

            <section className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Sector Impact</h3>
              <p className="leading-7 text-slate-300">{prediction.sector_impact}</p>
            </section>

            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Confidence Score</h3>
                <span className="text-sm text-slate-300">{prediction.confidence_score}%</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${prediction.confidence_score}%` }}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prediction.tags?.length > 0 ? (
                  prediction.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No tags were returned.</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
