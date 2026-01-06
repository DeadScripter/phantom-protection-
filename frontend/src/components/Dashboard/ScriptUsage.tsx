import { useScripts } from '../../hooks/useScripts'
import { useEffect } from 'react'

export default function ScriptUsage() {
  const { scripts, fetch } = useScripts()
  useEffect(() => { fetch() }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Script Usage</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scripts.map(s => (
          <div key={s.id} className="card">
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-400">Executions: <span className="text-white">{s.executions}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
