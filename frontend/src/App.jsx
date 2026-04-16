import ImpactPanel from "./components/ImpactPanel";
import { mockPrediction } from "./mockPrediction";
import { useEffect, useState } from "react";
import SectorSelector from "./components/SectorSelector";
import NewsCard from "./components/NewsCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { mockNews } from "./mockData";

export default function App() {
  const [selected, setSelected] = useState(["tech", "finance"]);
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const filteredNews = {};

      selected.forEach((sector) => {
        filteredNews[sector] = mockNews[sector] || [];
      });

      setNews(filteredNews);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selected]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {selected.map((sector) => (
            <div key={sector}>
              <h2 className="text-xl font-semibold capitalize mb-4">
                {sector}
              </h2>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  : news[sector]?.map((article) => (
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
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>
+
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