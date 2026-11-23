import { Link, useParams } from 'react-router-dom';
import TeamPicker from '../../../Components/Admin/TeamPicker';
import VariantEditor from '../../../Components/Admin/VariantEditor';
import ImageDropzone from '../../../Components/Admin/ImageDropzone';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useProductForm } from '../../../Hooks/useProductForm';
import { KIT_FORMATS, KIT_TYPES, SLEEVE_TYPES } from '../../../Helpers/constants';
import styles from './ProductForm.module.scss';

const ProductForm = () => {
  const { id } = useParams();
  const product = useProductForm(id);
  const { form, setField, errors } = product;

  if (product.loading) return <Loader />;
  if (product.notFound) {
    return (
      <Message type="error">
        No encontramos ese uniforme. <Link to="/admin/uniformes">Volver</Link>
      </Message>
    );
  }

  return (
    <form className={styles.form} onSubmit={product.submit} noValidate>
      <header className={styles.header}>
        <h1>{product.isEdit ? 'Editar uniforme' : 'Nuevo uniforme'}</h1>
        <Link to="/admin/uniformes">Cancelar</Link>
      </header>

      <section className={styles.card}>
        <TeamPicker
          value={form.teamName}
          onChange={(value) => setField('teamName', value)}
          teams={product.teams}
          leagues={product.leagues}
          leagueId={form.leagueId}
          onLeagueChange={(value) => setField('leagueId', value)}
          isNewTeam={product.isNewTeam}
          errors={errors}
        />

        <div className={styles.grid}>
          <label>
            Nombre del uniforme
            <input
              value={form.name}
              placeholder="Camiseta Local 2026"
              onChange={(event) => setField('name', event.target.value)}
            />
            {errors.name && (
              <span className={styles.error} data-error="true">
                {errors.name}
              </span>
            )}
          </label>
          <label>
            Versión
            <select value={form.kit_type} onChange={(event) => setField('kit_type', event.target.value)}>
              {KIT_TYPES.map((kit) => (
                <option key={kit.value} value={kit.value}>
                  {kit.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo de manga
            <select value={form.sleeve_type} onChange={(event) => setField('sleeve_type', event.target.value)}>
              {SLEEVE_TYPES.map((sleeve) => (
                <option key={sleeve.value} value={sleeve.value}>
                  {sleeve.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Formato
            <select value={form.kit_format} onChange={(event) => setField('kit_format', event.target.value)}>
              {KIT_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Temporada
            <input value={form.season} placeholder="2026/27" onChange={(event) => setField('season', event.target.value)} />
          </label>
          <label>
            Precio (COP)
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => setField('price', event.target.value)}
            />
            {errors.price && (
              <span className={styles.error} data-error="true">
                {errors.price}
              </span>
            )}
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setField('is_active', event.target.checked)}
            />
            Visible en la tienda
          </label>
        </div>

        <label>
          Descripción
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
          />
        </label>
      </section>

      <section className={styles.card}>
        <VariantEditor
          variants={product.variants}
          onToggle={product.toggleSize}
          onStock={product.setStock}
          error={errors.variants}
        />
      </section>

      <section className={styles.card}>
        <ImageDropzone dropzone={product.dropzone} error={errors.images} />
      </section>

      {Object.keys(errors).length > 0 && (
        <div className={styles.summary} role="alert">
          <strong>Falta completar:</strong>
          <ul>
            {Object.values(errors).map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <Message type="error">{product.submitError}</Message>

      <button type="submit" className={styles.submit} disabled={product.saving}>
        {product.saving ? 'Guardando…' : 'Guardar uniforme'}
      </button>
    </form>
  );
};

export default ProductForm;
