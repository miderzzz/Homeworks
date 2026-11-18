import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {nombre: "ana"}
      },
    })
    if (error) return alert(error.message);
    alert('Check your email for the login link!');
  }

  const login = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    alert('Check your email for the login link!');
  }

  return (
    <form onSubmit={login}>
        <h2>Login</h2>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} required
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={register}>Register</button>
    </form>
  );
};