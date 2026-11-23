import styles from './Message.module.scss';

const Message = ({ type = 'info', children }) => {
  if (!children) return null;
  return (
    <p className={`${styles.message} ${styles[type]}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
};

export default Message;
