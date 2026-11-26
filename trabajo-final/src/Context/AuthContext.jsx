import { createContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../Helpers/supabaseClient';
import * as authService from '../Services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(isSupabaseConfigured);
  const [profileState, setProfileState] = useState({ userId: null, profile: null });

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    authService
      .getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setSessionLoading(false));

    const subscription = authService.onAuthChange(setSession);
    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    authService
      .fetchProfile(userId)
      .then((profile) => active && setProfileState({ userId, profile }))
      .catch(() => active && setProfileState({ userId, profile: null }));

    return () => {
      active = false;
    };
  }, [userId]);

  const value = useMemo(() => {
    const profile = userId && profileState.userId === userId ? profileState.profile : null;
    const profileLoading = Boolean(userId) && profileState.userId !== userId;

    return {
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      isAdmin: profile?.role === 'admin' || profile?.role === 'empleado',
      isOwner: profile?.role === 'admin',
      loading: sessionLoading || profileLoading,
      signIn: authService.signIn,
      signUp: authService.signUp,
      signOut: authService.signOut,
    };
  }, [session, sessionLoading, profileState, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
