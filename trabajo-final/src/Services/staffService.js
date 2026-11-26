import { getClient, unwrap } from '../Helpers/supabaseClient';

export const fetchStaff = async () => unwrap(await getClient().rpc('list_staff')) ?? [];

export const setStaffRole = async (email, isStaff) =>
  unwrap(await getClient().rpc('set_staff_role', { p_email: email.trim(), p_is_staff: isStaff }));
