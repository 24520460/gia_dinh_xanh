import { useState, useEffect } from 'react';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export function useGeolocation(defaultCoords: GeoCoordinates = { lat: 10.7769, lng: 106.7009 }) {
  const [coords, setCoords] = useState<GeoCoordinates>(defaultCoords);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return { coords, error };
}
