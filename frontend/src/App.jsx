import { useState } from "react";
import SectorSelector from "./components/SectorSelector";
import { fetchNews } from "./api";

export default function App() {
  const [selected, setSelected] = useState(["tech", "finance"]);

  const testFetch = async () => {
    try {
      const data = await fetchNews(selected);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-2">
        Agentic AI News Impact
      </h1>

      <p className="text-slate-400 mb-8">
        Select sectors and analyze news impact.
      </p>

      <SectorSelector
        selected={selected}
        setSelected={setSelected}
      />

      <button
        onClick={testFetch}
        className="bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-xl font-medium"
      >
        Test Backend Connection
      </button>
    </div>
  );
}