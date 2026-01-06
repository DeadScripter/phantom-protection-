import { useState } from 'react'
import { useScripts } from '../hooks/useScripts'

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [tier, setTier] = useState<'standard' | 'premium'>('standard')
  const { create } = useScripts()

  const handle = async () => {
    await create({ name, code, tier })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Script</h3>
          <button onClick={onClose} className="btn-icon">✕</button>
        </div>

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Script name" className="input mb-3" />
        <select value={tier} onChange={e => setTier(e.target.value as any)} className="input mb-3">
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Paste Lua code" className="input h-64 font-mono" />

        <div className="flex gap-2 mt-4">
          <button onClick={handle} className="btn-primary">Save</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}
