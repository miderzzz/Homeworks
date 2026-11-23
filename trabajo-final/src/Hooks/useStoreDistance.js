import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchDrivingRoute, fetchStoreLocation } from '../Services/storeService';
import { distanceKm } from '../Helpers/geo';
import { CITY_SPEED_KMH, ROUTE_REFRESH_METERS, STORE_LOCATION } from '../Helpers/constants';

const ROAD_FACTOR = 1.3;

export const useStoreDistance = () => {
  const [store, setStore] = useState(STORE_LOCATION);
  const [status, setStatus] = useState('idle');
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState(null);
  const watchId = useRef(null);
  const lastRouted = useRef(null);
  const mounted = useRef(true);

  const target = useMemo(() => ({ lat: store.store_lat, lng: store.store_lng }), [store]);

  const stop = useCallback(() => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    if (watchId.current !== null) return;
    setStatus('locating');
    watchId.current = navigator.geolocation.watchPosition(
      (current) => {
        setPosition({ lat: current.coords.latitude, lng: current.coords.longitude });
        setStatus('ready');
      },
      (failure) => {
        stop();
        setStatus(failure.code === failure.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
    );
  }, [stop]);

  useEffect(() => {
    mounted.current = true;
    fetchStoreLocation()
      .then((data) => mounted.current && setStore(data))
      .catch(() => {});
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((permission) => permission.state === 'granted' && start())
      .catch(() => {});
    return () => {
      mounted.current = false;
      stop();
    };
  }, [start, stop]);

  useEffect(() => {
    if (!position) return;
    const last = lastRouted.current;
    const sameTarget = last && last.target.lat === target.lat && last.target.lng === target.lng;
    if (sameTarget && distanceKm(last.position, position) * 1000 < ROUTE_REFRESH_METERS) return;
    lastRouted.current = { position, target };
    fetchDrivingRoute(position, target)
      .then((result) => mounted.current && setRoute(result))
      .catch(() => mounted.current && setRoute(null));
  }, [position, target]);

  const straightKm = position ? distanceKm(position, target) : null;
  const km = route?.km ?? straightKm;
  const minutes = route?.minutes ?? (straightKm === null ? null : ((straightKm * ROAD_FACTOR) / CITY_SPEED_KMH) * 60);

  return { store, target, status, km, minutes, estimated: !route, start };
};
