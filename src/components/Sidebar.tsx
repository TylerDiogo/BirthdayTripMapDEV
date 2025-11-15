import type { TripStop } from '../data';
import SearchBar from './SearchBar';
import TripStopItem from './TripStopItem';

type SidebarProps = {
  stops: TripStop[];
  activeStopId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectStop: (stop: TripStop) => void;
};

const Sidebar = ({
  stops,
  activeStopId,
  searchQuery,
  onSearchChange,
  onSelectStop,
}: SidebarProps) => {
  return (
    <aside className="sidebar">
      <header>
        <h1>30th Birthday Trip</h1>
        <p>Follow the journey around the world.</p>
      </header>
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <div className="trip-list">
        {stops.map((stop) => (
          <TripStopItem
            key={stop.id}
            stop={stop}
            isActive={stop.id === activeStopId}
            onSelect={onSelectStop}
          />
        ))}
        {!stops.length && <p className="empty">No stops match that search.</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
