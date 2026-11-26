import { useStoreWhatsapp } from '../../Hooks/useStoreWhatsapp';
import { whatsappLink } from '../../Helpers/formatters';
import styles from './WhatsappButton.module.scss';

const MESSAGE = 'Hola Sport Champion, quiero información sobre un uniforme.';

const WhatsappButton = () => {
  const whatsapp = useStoreWhatsapp();

  return (
    <a
      className={styles.button}
      href={whatsappLink(whatsapp, MESSAGE)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.8 2 6.8L3 29l6.8-2.2c1.9 1 4 1.6 6.2 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 1.3 1.3-3.9-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.4 9.9 10.2 5.2 16 5.2s10.5 4.7 10.5 10.5S21.8 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.2 4.6 2.5 1 3 .8 3.6.8.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5 0-.1-.3-.2-.6-.4Z"
        />
      </svg>
      <span className={styles.label}>¿Dudas? Escríbenos</span>
    </a>
  );
};

export default WhatsappButton;
