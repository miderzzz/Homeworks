import { useCallback, useEffect, useState } from 'react';
import { fetchStaff, setStaffRole } from '../Services/staffService';
import { isEmail } from '../Helpers/validators';

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      setStaff(await fetchStaff());
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = async (target, isStaff) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await setStaffRole(target, isStaff);
      setMessage(isStaff ? `${target.trim()} ahora es empleado` : `${target.trim()} ya no tiene acceso al panel`);
      await load();
      return true;
    } catch (failure) {
      setError(failure.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const add = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Escribe un correo válido');
      return;
    }
    if (await change(email, true)) setEmail('');
  };

  const remove = (member) => {
    if (!window.confirm(`¿Quitar el acceso al panel a ${member.email}?`)) return;
    change(member.email, false);
  };

  return { staff, loading, email, setEmail, saving, error, message, add, remove };
};
