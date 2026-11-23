import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthRedirect = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  useEffect(() => {
    if (loading || !user) return;
    navigate(from ?? (isAdmin ? '/admin' : '/'), { replace: true });
  }, [user, isAdmin, loading, from, navigate]);
};
