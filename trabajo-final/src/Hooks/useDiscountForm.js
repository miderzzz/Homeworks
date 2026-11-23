import { useState } from 'react';
import { discountCodeError } from '../Helpers/validators';

const EMPTY = {
  code: '',
  discount_type: 'porcentaje',
  value: '',
  min_purchase: '',
  max_uses: '',
  expires_at: '',
};

export const useDiscountForm = (onCreate) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: field === 'code' ? value.toUpperCase().replace(/\s/g, '') : value }));

  const validate = () => {
    const value = Number(form.value);
    const codeProblem = discountCodeError(form.code);
    if (codeProblem) return codeProblem;
    if (!Number.isInteger(value) || value <= 0) return 'El valor del descuento debe ser un entero mayor que 0';
    if (form.discount_type === 'porcentaje' && value > 90) return 'El porcentaje máximo es 90%';
    if (form.min_purchase && Number(form.min_purchase) < 0) return 'La compra mínima no puede ser negativa';
    if (form.max_uses && (!Number.isInteger(Number(form.max_uses)) || Number(form.max_uses) <= 0)) {
      return 'Los usos máximos deben ser un entero mayor que 0';
    }
    if (form.expires_at && new Date(form.expires_at) <= new Date()) return 'La fecha de vencimiento debe ser futura';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;

    setSaving(true);
    try {
      await onCreate({
        code: form.code,
        discount_type: form.discount_type,
        value: Number(form.value),
        min_purchase: Number(form.min_purchase) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      });
      setForm(EMPTY);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  };

  return { form, setField, error, saving, submit };
};
