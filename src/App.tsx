import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Globe from './components/Globe';
import { useTripData } from './hooks/useTripData';
import type { TripStop } from './data';

const App = () => {
  const { stops, loading, error } = useTripData();
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) return stops;
    const q = searchQuery.toLowerCase();
    return stops.filter(
      (stop) =>
        stop.city.toLowerCase().includes(q) || stop.country.toLowerCase().includes(q)
    );
  }, [searchQuery, stops]);

  const handleSelectStop = (stop: TripStop) => {
    setActiveStopId(stop.id);
  };

  if (loading) {
    return <div className="status">Loading trip data…</div>;
  }

  if (error) {
    return <div className="status error">{error}</div>;
  }

  const isFiltering = Boolean(searchQuery.trim());

  return (
    <div className="app-root">
      <aside className="sidebar">
        <Sidebar
          stops={filteredStops}
          activeStopId={activeStopId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectStop={handleSelectStop}
        />
      </aside>
      <main className="globe-container">
        <Globe
          stops={stops}
          filteredStops={filteredStops}
          activeStopId={activeStopId}
          onSelectStop={handleSelectStop}
          isFiltering={isFiltering}
        />
      </main>
    </div>
  );
};

export default App;
