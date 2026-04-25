import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews, fetchPrediction } from "./api";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import ImpactPanel from "./components/ImpactPanel";
import LoadingSkeleton from "./components/LoadingSkeleton";
import NewsCard from "./components/NewsCard";
import SectorSelector from "./components/SectorSelector";

const DEFAULT_SELECTED_SECTORS = ["technology", "finance"];
const LOADING_PREDICTION = {
  impact_level: "Loading",
  summary: "Loading analysis...",
  affected_entities: [],
  short_term_impact: "",
  long_term_impact: "",
  sector_impact: "",
  confidence_score: 0,
  tags: [],
};

export default function App() {
  const [selected, setSelected] = useState(DEFAULT_SELECTED_SECTORS);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const {
    data: news = {},
    error,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ["news", selected],
    queryFn: () => fetchNews(selected),
    refetchInterval: 1000 * 60 * 15,
  });

  const handleArticleClick = async (article, sector) => {
    setSelectedArticle({ ...article, sector });
    setPrediction(null);
    setPredictionError("");
    setPredictionLoading(true);

    try {
      const response = await fetchPrediction({
        headline: article.headline,
        content: article.content,
        sector,
      });
      setPrediction(response);
    } catch (requestError) {
      setPredictionError(
        requestError?.response?.data?.detail || "Could not analyze this article."
      );
    } finally {
      setPredictionLoading(false);
    }
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
  const newsError =
    error?.response?.data?.detail || error?.message || "Could not load news.";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Agentic AI News Impact System</h1>
            <p className="text-slate-400">
              Select sectors to analyze live news and generate impact predictions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Refresh News
          </button>
        </div>

        <div className="mt-8">
          <SectorSelector selected={selected} setSelected={setSelected} />
        </div>

        {lastUpdated && (
          <p className="mb-4 text-sm text-slate-500">
            Last updated: {lastUpdated.toLocaleString()}
            {isFetching && !isLoading ? " (refreshing)" : ""}
          </p>
        )}

        {error && (
          <div className="mb-6">
            <ErrorState message={newsError} />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {selected.map((sector) => (
            <div key={sector}>
              <h2 className="mb-4 text-xl font-semibold capitalize">{sector}</h2>

              <div className="space-y-4">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  : news[sector]?.length > 0
                    ? news[sector].map((article) => (
                        <NewsCard
                          key={article.id}
                          article={{ ...article, sector }}
                          onClick={() => handleArticleClick(article, sector)}
                        />
                      ))
                    : <EmptyState sector={sector} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <ImpactPanel
          article={selectedArticle}
          prediction={predictionLoading ? LOADING_PREDICTION : prediction}
          error={predictionError}
          onClose={() => {
            setSelectedArticle(null);
            setPrediction(null);
            setPredictionError("");
            setPredictionLoading(false);
          }}
        />
      )}
    </div>
  );
}
