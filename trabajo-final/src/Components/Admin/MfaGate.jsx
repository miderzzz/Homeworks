import Loader from '../Shared/Loader';
import Message from '../Shared/Message';
import { useMfaGate } from '../../Hooks/useMfaGate';
import styles from './MfaGate.module.scss';

const MfaGate = ({ children }) => {
  const { status, setup, code, changeCode, submit, error, verifying, retry, codeLength } = useMfaGate();

  if (status === 'ok') return children;
  if (status === 'checking') return <Loader text="Verificando seguridad…" />;

  if (status === 'error') {
    return (
      <div className={styles.card}>
        <h2>No se pudo activar la verificación</h2>
        <Message type="error">{error}</Message>
        <p className={styles.help}>
          Revisa que en Supabase esté activo Authentication → Multi-Factor → TOTP (App Authenticator).
        </p>
        <button type="button" onClick={retry}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={submit}>
      <span className={styles.badge}>Zona protegida</span>
      <h2>{status === 'enroll' ? 'Activa Google Authenticator' : 'Código de verificación'}</h2>

      {status === 'enroll' ? (
        <>
          <ol className={styles.steps}>
            <li>Instala Google Authenticator en tu celular.</li>
            <li>Toca el botón + y elige “Escanear un código QR”.</li>
            <li>Escanea este código y escribe los {codeLength} dígitos que aparecen.</li>
          </ol>
          <img src={setup.qr} alt="Código QR para Google Authenticator" className={styles.qr} />
          <p className={styles.help}>
            ¿No puedes escanear? Escribe esta clave en la app: <code className={styles.secret}>{setup.secret}</code>
          </p>
        </>
      ) : (
        <p className={styles.help}>
          Abre Google Authenticator y escribe el código de {codeLength} dígitos de Sport Champion.
        </p>
      )}

      <input
        className={styles.code}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder={'0'.repeat(codeLength)}
        value={code}
        onChange={(event) => changeCode(event.target.value)}
        autoFocus
      />
      <Message type="error">{error}</Message>
      <button type="submit" className={styles.submit} disabled={verifying}>
        {verifying ? 'Verificando…' : 'Verificar'}
      </button>
    </form>
  );
};

export default MfaGate;
