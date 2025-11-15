export type TripStop = {
  id: string;
  order: number;
  city: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  note: string;
};

export const sortStops = (stops: TripStop[]): TripStop[] =>
  [...stops].sort((a, b) => a.order - b.order);
