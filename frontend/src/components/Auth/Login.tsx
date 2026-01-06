import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="input" required />
      <button className="btn-primary">Login</button>
    </form>
  )
}
