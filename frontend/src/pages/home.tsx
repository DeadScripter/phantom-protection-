import { useState } from 'react'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'

export default function Home() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Phantom Protection</h1>
        <p className="text-gray-400 mb-6">Secure Lua loadstring hosting & whitelisting.</p>

        <div className="flex mb-4">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 ${tab==='login'?'bg-gray-700':'bg-gray-800'}`}>Login</button>
          <button onClick={() => setTab('signup')} className={`flex-1 py-2 ${tab==='signup'?'bg-gray-700':'bg-gray-800'}`}>Sign Up</button>
        </div>

        {tab === 'login' ? <Login /> : <Signup />}
      </div>
    </div>
  )
}
