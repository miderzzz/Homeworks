import MfaGate from '../../../Components/Admin/MfaGate';
import StaffTable from '../../../Components/Admin/StaffTable';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useStaff } from '../../../Hooks/useStaff';
import styles from './Team.module.scss';

const StaffManager = () => {
  const { staff, loading, email, setEmail, saving, error, message, add, remove } = useStaff();

  return (
    <>
      <form className={styles.form} onSubmit={add} noValidate>
        <label>
          Correo del empleado
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Dar acceso de empleado'}
        </button>
      </form>
      <Message type="error">{error}</Message>
      <Message type="success">{message}</Message>
      {loading ? <Loader /> : <StaffTable staff={staff} onRemove={remove} saving={saving} />}
    </>
  );
};

const Team = () => (
  <div className={styles.page}>
    <h1>Equipo</h1>
    <p className={styles.intro}>
      Da acceso al panel a tus empleados con el correo con el que se registraron en la tienda. Los empleados pueden
      gestionar pedidos, uniformes, inventario y descuentos, pero no pueden entrar a esta sección.
    </p>
    <MfaGate>
      <StaffManager />
    </MfaGate>
  </div>
);

export default Team;
