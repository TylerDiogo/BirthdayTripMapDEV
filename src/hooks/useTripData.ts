import { useEffect, useState } from 'react';
import type { TripStop } from '../data';
import { sortStops } from '../data';

export const useTripData = () => {
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/trip-data.json');
        if (!response.ok) {
          throw new Error('Failed to load trip data');
        }
        const data: TripStop[] = await response.json();
        setStops(sortStops(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stops, loading, error };
};
