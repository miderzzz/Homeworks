import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../../Components/Shared/AuthForm';
import { useLoginForm } from '../../Hooks/useLoginForm';
import { useAuthRedirect } from '../../Hooks/useAuthRedirect';
import styles from './Register.module.scss';

const Register = () => {
  const location = useLocation();
  const { form, setField, error, message, saving, submit } = useLoginForm('register');
  useAuthRedirect();

  return (
    <div className={styles.page}>
      <AuthForm
        mode="register"
        variant="dark"
        eyebrow="Datos personales"
        title="Crea tu cuenta"
        submitText="Registrarme"
        form={form}
        onChange={setField}
        onSubmit={submit}
        error={error}
        message={message}
        saving={saving}
        footer={
          <>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" state={location.state}>
              Inicia sesión
            </Link>
          </>
        }
      />
    </div>
  );
};

export default Register;
