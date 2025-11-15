import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import type { TripStop } from '../data';

const DEFAULT_MAPBOX_TOKEN =
  'pk.eyJ1IjoidHlsZXJkaW9nbyIsImEiOiJjbTM2a3hsZDcwNmN4MmpxNGNpeGd0Nm5rIn0.d_aTkF3ueth7gfO9k6ui7g';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? DEFAULT_MAPBOX_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN;

// INITIAL_CAMERA uses Mapbox CameraOptions:
// - center: where the camera is looking
// - zoom: distance from the earth
// - pitch: tilt angle (0 = top-down, ~60 = 3D)
// - bearing: rotation (0 = north-up)
const INITIAL_CAMERA: mapboxgl.CameraOptions = {
  center: [-25, 32],
  zoom: 1.85,
  pitch: 58,
  bearing: -75,
};

const adjustLongitudeForAntimeridian = (startLng: number, endLng: number) => {
  if (Math.abs(endLng - startLng) <= 180) {
    return endLng;
  }
  return endLng > startLng ? endLng - 360 : endLng + 360;
};

const createArcCoordinates = (from: TripStop, to: TripStop) => {
  const steps = 64;
  const coords: [number, number, number][] = [];
  const startLng = from.lng;
  const endLng = adjustLongitudeForAntimeridian(startLng, to.lng);

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lat = from.lat + (to.lat - from.lat) * t;
    const lng = startLng + (endLng - startLng) * t;
    const altitude = Math.sin(Math.PI * t) * 400000; // meters above ground
    coords.push([lng, lat, altitude]);
  }
  return coords;
};

type GlobeProps = {
  stops: TripStop[];
  filteredStops: TripStop[];
  activeStopId: string | null;
  onSelectStop: (stop: TripStop) => void;
  isFiltering: boolean;
};

const Globe = ({ stops, filteredStops, activeStopId, onSelectStop, isFiltering }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const filteredIds = useMemo(() => new Set(filteredStops.map((stop) => stop.id)), [
    filteredStops,
  ]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    setIsMapLoaded(false);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      accessToken: MAPBOX_TOKEN,
      ...INITIAL_CAMERA,
    });

    map.on('load', () => {
      map.setFog({
        color: '#111827',
        'high-color': '#1f2937',
        'space-color': '#020617',
        'horizon-blend': 0.1,
      } as mapboxgl.FogSpecification);
      setIsMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!popupRef.current) {
      popupRef.current = new mapboxgl.Popup({ offset: 16, closeButton: false, closeOnClick: false });
    }

    stops.forEach((stop) => {
      const el = document.createElement('button');
      el.className = 'marker';
      if (stop.id === activeStopId) {
        el.classList.add('active');
      } else if (isFiltering && filteredIds.has(stop.id)) {
        el.classList.add('highlighted');
      } else if (isFiltering) {
        el.classList.add('dimmed');
      }
      el.setAttribute('aria-label', `${stop.city}, ${stop.country}`);

      el.addEventListener('mouseenter', () => {
        popupRef.current
          ?.setLngLat([stop.lng, stop.lat])
          .setHTML(
            `<strong>${stop.city}, ${stop.country}</strong><br/><small>${stop.date}</small><p>${stop.note}</p>`
          )
          .addTo(map);
      });

      el.addEventListener('mouseleave', () => {
        popupRef.current?.remove();
      });

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        onSelectStop(stop);
      });

      const marker = new mapboxgl.Marker({ element: el }).setLngLat([stop.lng, stop.lat]).addTo(map);
      markersRef.current.push(marker);
    });
  }, [stops, filteredIds, activeStopId, onSelectStop, isFiltering, isMapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    const sourceId = 'trip-arcs';

    const features = stops.slice(0, -1).map((stop, index) => {
      const next = stops[index + 1];
      const highlighted = isFiltering && filteredIds.has(stop.id) && filteredIds.has(next.id);
      return {
        type: 'Feature' as const,
        properties: {
          id: `${stop.id}-${next.id}`,
          highlighted,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: createArcCoordinates(stop, next),
        },
      };
    });

    const data = {
      type: 'FeatureCollection' as const,
      features,
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(data);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data,
        lineMetrics: true,
      });

      map.addLayer({
        id: sourceId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'highlighted'], false],
            '#ffffff',
            '#ff8c42',
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.5,
            3,
            3.5,
          ],
          'line-opacity': 0.85,
          'line-blur': 0.2,
          'line-emissive-strength': 0.6,
        },
      });
    }
  }, [stops, filteredIds, isFiltering, isMapLoaded]);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !activeStopId) return;
    const targetStop = stops.find((stop) => stop.id === activeStopId);
    if (!targetStop) return;

    mapRef.current.flyTo({
      center: [targetStop.lng, targetStop.lat],
      zoom: 3.5,
      speed: 0.8,
      pitch: 55,
      bearing: INITIAL_CAMERA.bearing,
    });
  }, [activeStopId, isMapLoaded, stops]);

  return <div className="globe" ref={containerRef} role="presentation" />;
};

export default Globe;
