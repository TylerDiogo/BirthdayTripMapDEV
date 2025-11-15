import clsx from 'clsx';
import type { TripStop } from '../data';

type TripStopItemProps = {
  stop: TripStop;
  isActive: boolean;
  onSelect: (stop: TripStop) => void;
};

const TripStopItem = ({ stop, isActive, onSelect }: TripStopItemProps) => (
  <button
    className={clsx('trip-stop', { active: isActive })}
    onClick={() => onSelect(stop)}
  >
    <div className="trip-stop-date">{stop.date}</div>
    <div>
      <div className="trip-stop-city">
        {stop.city}, <span className="country">{stop.country}</span>
      </div>
      <div className="trip-stop-note">{stop.note}</div>
    </div>
  </button>
);

export default TripStopItem;
