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
  const { signup } = useAuth()

  return (
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="input" required />
      <div id="cf-turnstile" className="cf-turnstile" />
      <button className="btn-primary">Create Account</button>
    </form>
  )
}
