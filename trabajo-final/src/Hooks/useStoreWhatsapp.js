import { useEffect, useState } from 'react';
import { fetchStoreWhatsapp } from '../Services/storeService';
import { STORE_WHATSAPP } from '../Helpers/constants';

export const useStoreWhatsapp = () => {
  const [whatsapp, setWhatsapp] = useState(STORE_WHATSAPP);

  useEffect(() => {
    let active = true;
    fetchStoreWhatsapp()
      .then((number) => active && number && setWhatsapp(number))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return whatsapp;
};
