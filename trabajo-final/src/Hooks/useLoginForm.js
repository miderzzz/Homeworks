import { useState } from 'react';
import { useAuth } from './useAuth';
import { isEmail, isPhoneNumber } from '../Helpers/validators';
import { onlyDigits } from '../Helpers/formatters';
import { DEFAULT_COUNTRY_CODE } from '../Helpers/constants';

const EMPTY = { fullName: '', phoneCode: DEFAULT_COUNTRY_CODE, phone: '', email: '', password: '' };

export const useLoginForm = (mode) => {
  const { signIn, signUp } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    if (mode === 'register' && form.fullName.trim().length < 3) return 'Escribe tu nombre completo';
    if (mode === 'register' && !isPhoneNumber(form.phone)) return 'Escribe tu número de celular (solo números)';
    if (!isEmail(form.email)) return 'Escribe un correo válido';
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validate();
    setError(found);
    setMessage('');
    if (found) return;

    setSaving(true);
    try {
      if (mode === 'register') {
        const data = await signUp({ ...form, phone: `${form.phoneCode}${onlyDigits(form.phone)}` });
        if (!data.session) setMessage('Te enviamos un correo para confirmar tu cuenta.');
      } else {
        await signIn(form.email, form.password);
      }
    } catch (failure) {
      setError(
        failure.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : failure.message,
      );
    } finally {
      setSaving(false);
    }
  };

  return { form, setField, error, message, saving, submit };
};
