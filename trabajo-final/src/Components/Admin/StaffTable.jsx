import { formatDate } from '../../Helpers/formatters';
import styles from './StaffTable.module.scss';

const ROLE_LABELS = { admin: 'Dueño', empleado: 'Empleado' };

const StaffTable = ({ staff, onRemove, saving }) => (
  <div className={styles.wrapper}>
    <table>
      <thead>
        <tr>
          <th>Correo</th>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Registrado</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {staff.map((member) => (
          <tr key={member.id}>
            <td>{member.email}</td>
            <td>{member.full_name || '—'}</td>
            <td>
              <span className={member.role === 'admin' ? styles.owner : styles.employee}>
                {ROLE_LABELS[member.role]}
              </span>
            </td>
            <td>{formatDate(member.created_at)}</td>
            <td className={styles.actions}>
              {member.role === 'empleado' && (
                <button type="button" className={styles.remove} onClick={() => onRemove(member)} disabled={saving}>
                  Quitar acceso
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StaffTable;
