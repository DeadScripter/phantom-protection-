import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

declare global {
  interface Window {
    turnstile: any
  }
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cfToken, setCfToken] = useState('')
  const { signup } = useAuth()

  const handleCf = (token: string) => setCfToken(token)

  useState(() => {
    if (window.turnstile) {
      window.turnstile.render('#cf-turnstile', {
        sitekey: import.meta.env.VITE_CF_SITEKEY,
        callback: handleCf,
      })
    }
  })

  

  return (
    <form onSubmit={handle} className="space-y-4">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="input" required />
      <div id="cf-turnstile" className="cf-turnstile" />
      <button className="btn-primary">Create Account</button>
    </form>
  )
}
