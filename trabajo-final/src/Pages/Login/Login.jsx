import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../../Components/Shared/AuthForm';
import { useLoginForm } from '../../Hooks/useLoginForm';
import { useAuthRedirect } from '../../Hooks/useAuthRedirect';
import styles from './Login.module.scss';

const Login = () => {
  const location = useLocation();
  const { form, setField, error, message, saving, submit } = useLoginForm('login');
  useAuthRedirect();

  return (
    <div className={styles.page}>
      <AuthForm
        mode="login"
        variant="light"
        title="Hola de nuevo"
        subtitle="Inicia sesión para continuar en Sport Champion"
        submitText="Entrar"
        form={form}
        onChange={setField}
        onSubmit={submit}
        error={error}
        message={message}
        saving={saving}
        footer={
          <>
            ¿Nuevo en Sport Champion?{' '}
            <Link to="/registro" state={location.state}>
              Crear cuenta
            </Link>
            <br />
            No necesitas cuenta para comprar. <Link to="/catalogo">Ver catálogo</Link>
          </>
        }
      />
    </div>
  );
};

export default Login;
