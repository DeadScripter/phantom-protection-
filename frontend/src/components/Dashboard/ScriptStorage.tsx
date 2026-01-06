import { useState } from 'react'
import { useScripts } from '../../hooks/useScripts'
import UploadModal from '../UploadModal'
import LoaderModal from '../LoaderModal'
import ConfirmDialog from '../ConfirmDialog'

export default function ScriptStorage() {
  const { scripts, fetch, remove } = useScripts()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loaderOpen, setLoaderOpen] = useState(false)
  const [scriptId, setScriptId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openLoader = (id: string) => {
    setScriptId(id)
    setLoaderOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Script Storage</h2>
        <button onClick={() => setUploadOpen(true)} className="btn-primary">Upload Script</button>
      </div>

      <div className="space-y-3">
        {scripts.map(s => (
          <div key={s.id} className="card flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-xs text-gray-400">{s.tier}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openLoader(s.id)} className="btn-secondary">Get Loader</button>
              <button onClick={() => setDeleteId(s.id)} className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {uploadOpen && <UploadModal onClose={() => { setUploadOpen(false); fetch() }} />}
      {loaderOpen && scriptId && <LoaderModal scriptId={scriptId} onClose={() => setLoaderOpen(false)} />}
      {deleteId && <ConfirmDialog title="Delete script?"
        onConfirm={async () => { await remove(deleteId); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)} />}
    </div>
  )
}
