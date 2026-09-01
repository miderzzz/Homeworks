import type {Contact} from '../types';
interface Props {
    contact: Contact;
    onDelete: (id: number) => void;

}

function ContactItem({ contact, onDelete }: Props) {
    return (
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span>{contact.name} - {contact.phone}</span>
            <button onClick={() => onDelete(contact.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Eliminar</button>
        </li>

    )}

    export default ContactItem;