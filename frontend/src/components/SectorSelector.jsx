export default function SectorSelector({ selected, setSelected }) {
  const sectors = ["tech", "finance", "business", "health"];

  const toggleSector = (sector) => {
    if (selected.includes(sector)) {
      if (selected.length <= 2) return;
      setSelected(selected.filter((s) => s !== sector));
    } else {
      setSelected([...selected, sector]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {sectors.map((sector) => (
        <button
          key={sector}
          onClick={() => toggleSector(sector)}
          className={`px-4 py-2 rounded-full border transition ${
            selected.includes(sector)
              ? "bg-blue-600 border-blue-600"
              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
          }`}
        >
          {sector}
        </button>
      ))}
    </div>
  );
}