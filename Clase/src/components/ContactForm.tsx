import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
    onAdd: (name: string, phone: string) => void;
}

function ContactForm({ onAdd }: Props) {
    
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (name.trim() === "" || phone.trim() === "") {
            return;
        }

        onAdd(name, phone);
        setName("");
        setPhone("");
    };

    return (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }} onSubmit={handleSubmit}>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            />
            <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono"
            />
            <button type="submit" style={{ backgroundColor: 'red', color: 'white', border: '2px solid #fdfffe', padding: '10px', cursor: 'pointer' }}>Agregar Contacto</button>
        </form>
    )}

export default ContactForm;