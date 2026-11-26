import { getClient, unwrap } from '../Helpers/supabaseClient';

export const fetchStoreLocation = async () =>
  unwrap(
    await getClient()
      .from('store_settings')
      .select('store_name, store_address, store_lat, store_lng')
      .eq('id', 1)
      .single(),
  );

export const fetchDrivingRoute = async (from, to) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo calcular la ruta');
  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error('No hay ruta disponible');
  return { km: route.distance / 1000, minutes: route.duration / 60 };
};

export const fetchStoreWhatsapp = async () =>
  unwrap(await getClient().from('store_settings').select('whatsapp').eq('id', 1).single()).whatsapp;
