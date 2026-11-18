import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { Tasks } from './components/Tasks';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Login />;
  }

return (
  <div>
    <header className="topbar">
      <p className="welcome">Welcome, {session.user.email.split('@')[0]}</p>
      <button className="btn-logout" onClick={logout}>Logout</button>
    </header>

    <Tasks />
  </div>
);
}

export default App;