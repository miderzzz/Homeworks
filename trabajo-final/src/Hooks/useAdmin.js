import { useContext } from 'react';
import { AdminContext } from '../Context/AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin debe usarse dentro de AdminProvider');
  return context;
};
