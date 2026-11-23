import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import { createOrder, notifyOrder } from '../Services/orderService';
import { isEmail, isPhoneNumber } from '../Helpers/validators';
import { onlyDigits, splitPhone } from '../Helpers/formatters';
import { DEFAULT_COUNTRY_CODE } from '../Helpers/constants';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { discount, toOrderLines, clearCart } = useCart();

  const [form, setForm] = useState(() => ({
    name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phoneCode: profile?.phone ? splitPhone(profile.phone).code : DEFAULT_COUNTRY_CODE,
    phone: profile?.phone ? splitPhone(profile.phone).number : '',
    address: '',
  }));
  const [prefilledFor, setPrefilledFor] = useState(profile?.id ?? null);
  const [errors, setErrors] = useState({});

  if (profile && prefilledFor !== profile.id) {
    setPrefilledFor(profile.id);
    setForm((current) => ({
      ...current,
      name: current.name || profile.full_name || '',
      email: current.email || user?.email || '',
      phoneCode: current.phone ? current.phoneCode : splitPhone(profile.phone ?? '').code,
      phone: current.phone || splitPhone(profile.phone ?? '').number,
    }));
  }
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const found = {};
    if (form.name.trim().length < 3) found.name = 'Escribe tu nombre completo';
    if (!isEmail(form.email)) found.email = 'Escribe un correo válido';
    if (!isPhoneNumber(form.phone)) found.phone = 'Escribe tu número de celular (solo números)';
    if (form.address.trim().length < 10) found.address = 'Escribe la dirección completa de envío';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError('');
    try {
      const order = await createOrder({
        lines: toOrderLines(),
        customer: { name: form.name, email: form.email, phone: `${form.phoneCode}${onlyDigits(form.phone)}` },
        address: form.address,
        discountCode: discount?.code,
      });
      notifyOrder(order.order_code).catch(() => null);
      clearCart();
      navigate(`/confirmacion/${order.order_code}`, { state: { order } });
    } catch (error) {
      setSubmitError(error.message);
      setSaving(false);
    }
  };

  return { form, setField, errors, submitError, saving, submit, isGuest: !user };
};
