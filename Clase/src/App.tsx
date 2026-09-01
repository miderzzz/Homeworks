import { useState, useEffect } from 'react';
import type { Contact } from './types';
import { mockContacts } from './data/contactsBase';
import Loader from './components/Loader';
import ContactForm from './components/ContactForm';
import ContactList from './components/contactList';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const addContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now(),
      name,
      phone,
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'Red', fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 'bold', textAlign: 'center' }}>Mis Contactos</h1>
      <ContactForm onAdd={addContact} />
      <ContactList contacts={contacts} onDelete={deleteContact} />
    </div>
  );
}

export default App;