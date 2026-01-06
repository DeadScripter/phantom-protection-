import { useEffect, useState } from 'react'
import { scripts } from '../utils/api'

export default function LoaderModal({ scriptId, onClose }: { scriptId: string; onClose: () => void }) {
  const [loader, setLoader] = useState('')

  useEffect(() => {
    scripts.loader(scriptId).then(r => setLoader(r.data))
  }, [scriptId])

  const copy = () => {
    navigator.clipboard.writeText(loader)
    alert('Copied!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Loader Script</h3>
          <button onClick={onClose} className="btn-icon">✕</button>
        </div>

        <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-96 text-sm">{loader}</pre>

        <div className="flex gap-2 mt-4">
          <button onClick={copy} className="btn-primary">Copy</button>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  )
}
