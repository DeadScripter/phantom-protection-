import { useState } from 'react'
import { auth } from '../../utils/api'

export default function TwoFactor({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')

  const setup = async () => {
    const { data } = await auth.setup2FA()
setQr(data.qr)
setSecret(data.base32)   // ← was secret.base32
  }

  const verify = async () => {
    await auth.verify2FA(token)
    onSuccess()
  }

  useState(() => { setup() })

  return (
    <div className="space-y-4">
      {qr && <img src={qr} alt="QR" className="w-48" />}
      <p className="text-sm">Secret: <code>{secret}</code></p>
      <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="6-digit code" className="input" />
      <button onClick={verify} className="btn-primary">Verify</button>
    </div>
  )
}
