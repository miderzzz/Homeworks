import { getClient, unwrap } from '../Helpers/supabaseClient';

export const signIn = async (email, password) =>
  unwrap(await getClient().auth.signInWithPassword({ email: email.trim(), password }));

export const signUp = async ({ email, password, fullName, phone }) =>
  unwrap(
    await getClient().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim(), phone: phone.replace(/\D/g, '') } },
    }),
  );

export const signOut = async () => {
  const { error } = await getClient().auth.signOut();
  if (error) throw new Error(error.message);
};

export const getSession = async () => unwrap(await getClient().auth.getSession()).session;

export const onAuthChange = (callback) =>
  getClient().auth.onAuthStateChange((_event, session) => callback(session)).data.subscription;

export const fetchProfile = async (userId) =>
  unwrap(await getClient().from('profiles').select('*').eq('id', userId).single());
