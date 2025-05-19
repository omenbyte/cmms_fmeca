'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Login() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    await signIn('credentials', { username, password, callbackUrl: '/' });
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
      <input className="w-full border p-2" placeholder="Username" value={username} onChange={e=>setU(e.target.value)}/>
      <input type="password" className="w-full border p-2" placeholder="Password" value={password} onChange={e=>setP(e.target.value)}/>
      <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}