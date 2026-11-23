import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from './useCatalog';
import { useImageDropzone } from './useImageDropzone';
import { saveProduct } from '../Services/productService';
import { SIZES } from '../Helpers/constants';
import { normalizeName, toTitleCase } from '../Helpers/formatters';

const EMPTY_FORM = {
  name: '',
  description: '',
  teamName: '',
  leagueId: '',
  kit_type: 'local',
  sleeve_type: 'corta',
  kit_format: 'camiseta',
  season: '2026/27',
  price: '50000',
  is_active: true,
};

const DEFAULT_STOCK = 2;

const emptyVariants = (enabled = true) =>
  Object.fromEntries(SIZES.map((size) => [size, { enabled, stock: DEFAULT_STOCK, id: null }]));

const variantsFrom = (product) => {
  const variants = emptyVariants(false);
  product.variants.forEach((variant) => {
    variants[variant.size] = { enabled: variant.stock > 0, stock: variant.stock, id: variant.id };
  });
  return variants;
};

export const useProductForm = (id) => {
  const navigate = useNavigate();
  const { products, leagues, teams, loading, reload } = useCatalog();
  const dropzone = useImageDropzone();

  const product = id ? products.find((item) => String(item.id) === String(id)) : null;

  const [form, setForm] = useState(EMPTY_FORM);
  const [variants, setVariants] = useState(() => emptyVariants());
  const [loadedId, setLoadedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  if (product && loadedId !== product.id) {
    setLoadedId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      teamName: toTitleCase(product.team),
      leagueId: product.league_id ?? '',
      kit_type: product.kit_type,
      sleeve_type: product.sleeve_type,
      kit_format: product.kit_format,
      season: product.season ?? '',
      price: String(product.price),
      is_active: product.is_active,
    });
    setVariants(variantsFrom(product));
    dropzone.reset(product.images);
  }

  const isNewTeam = useMemo(() => {
    const name = normalizeName(form.teamName);
    return name.length > 0 && !teams.some((team) => team.name === name);
  }, [form.teamName, teams]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const toggleSize = (size) =>
    setVariants((current) => ({ ...current, [size]: { ...current[size], enabled: !current[size].enabled } }));

  const setStock = (size, stock) =>
    setVariants((current) => ({
      ...current,
      [size]: { ...current[size], stock: Math.max(0, Math.floor(Number(stock) || 0)) },
    }));

  const validate = () => {
    const found = {};
    const price = Number(form.price);
    if (form.name.trim().length < 3 || form.name.trim().length > 80) found.name = 'El nombre debe tener entre 3 y 80 caracteres';
    if (normalizeName(form.teamName).length < 2) found.teamName = 'Escribe o elige el equipo';
    if (isNewTeam && !form.leagueId) found.leagueId = 'El equipo es nuevo: elige en qué liga va';
    if (!Number.isInteger(price) || price <= 0) found.price = 'El precio debe ser un número entero mayor que 0';
    if (!Object.values(variants).some((variant) => variant.enabled)) found.variants = 'Activa al menos una talla';
    if (dropzone.images.length === 0) found.images = 'Agrega al menos una imagen';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      requestAnimationFrame(() => {
        document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    setSaving(true);
    setSubmitError('');
    try {
      await saveProduct({
        id: product?.id,
        form,
        leagueId: isNewTeam ? Number(form.leagueId) : null,
        variants,
        images: dropzone.images,
        previousImages: product?.images ?? [],
      });
      await reload();
      navigate('/admin/uniformes');
    } catch (error) {
      setSubmitError(error.message);
      setSaving(false);
    }
  };

  return {
    isEdit: Boolean(id),
    notFound: Boolean(id) && !loading && !product,
    loading: Boolean(id) && loading,
    form,
    setField,
    variants,
    toggleSize,
    setStock,
    dropzone,
    leagues,
    teams,
    isNewTeam,
    errors,
    submitError,
    saving,
    submit,
  };
};
