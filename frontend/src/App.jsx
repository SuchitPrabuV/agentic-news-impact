import ImpactPanel from "./components/ImpactPanel";
import { mockPrediction } from "./mockPrediction";
import { useState } from "react";
import SectorSelector from "./components/SectorSelector";
import NewsCard from "./components/NewsCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { mockNews } from "./mockData";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { useQuery } from "@tanstack/react-query";

export default function App() {
  const [selected, setSelected] = useState(["tech", "finance"]);
  const [news, setNews] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const { isLoading } = useQuery({
    queryKey: ["news", selected],
    queryFn: async () => {
      setError("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const filteredNews = {};

        selected.forEach((sector) => {
          filteredNews[sector] = mockNews[sector] || [];
        });

        setNews(filteredNews);
        setLastUpdated(new Date());
        return filteredNews;
      } catch (err) {
        setError("Could not load news. Please try again.");
        return {};
      }
    },
    refetchInterval: 1000 * 60 * 15,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Agentic AI News Impact System
        </h1>

        <p className="text-slate-400 mb-8">
          Select sectors to analyze live news.
        </p>

        <SectorSelector
          selected={selected}
          setSelected={setSelected}
        />

        {lastUpdated && (
          <p className="text-sm text-slate-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {error && (
          <div className="mb-6">
            <ErrorState message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {selected.map((sector) => (
            <div key={sector}>
              <h2 className="text-xl font-semibold capitalize mb-4">
                {sector}
              </h2>

              <div className="space-y-4">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  : news[sector]?.length > 0 ? (
                    news[sector].map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        onClick={() => {
                          setSelectedArticle(article);
                          setPrediction(null);
                          setPredictionLoading(true);

                          setTimeout(() => {
                            setPrediction(mockPrediction);
                            setPredictionLoading(false);
                          }, 1000);
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState sector={sector} />
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <ImpactPanel
          article={selectedArticle}
          prediction={
            predictionLoading
              ? {
                  impact_level: "Loading",
                  summary: "Loading analysis...",
                  affected_entities: [],
                  short_term_impact: "",
                  long_term_impact: "",
                  sector_impact: "",
                  confidence_score: 0,
                  tags: [],
                }
              : prediction
          }
          onClose={() => {
            setSelectedArticle(null);
            setPrediction(null);
          }}
        />
      )}
    </div>
  );
}