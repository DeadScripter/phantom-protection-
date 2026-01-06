import { useState, useEffect } from 'react'
import { whitelist } from '../../utils/api'
import { useScripts } from '../../hooks/useScripts'
import { WhitelistEntry } from '../../utils/types'

export default function KeySystem() {
  const { scripts } = useScripts()
  const [list, setList] = useState<WhitelistEntry[]>([])
  const [form, setForm] = useState({ scriptId: '', discordId: '', robloxId: '', expires: 'unlimited' })

  const load = async () => {
    if (!form.scriptId) return
    const { data } = await whitelist.list(form.scriptId)
    setList(data)
  }

  useEffect(() => { load() }, [form.scriptId])

  const add = async () => {
    await whitelist.add({ script_id: form.scriptId, discord_id: form.discordId, roblox_id: form.robloxId, expires_at: form.expires === 'unlimited' ? null : form.expires })
    setForm({ ...form, discordId: '', robloxId: '' })
    await load()
  }

  const remove = async (id: string) => {
    await whitelist.remove(id)
    await load()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Key System</h2>

      <div className="card space-y-3 mb-6">
        <select value={form.scriptId} onChange={e => setForm({ ...form, scriptId: e.target.value })} className="input">
          <option value="">Select script</option>
          {scripts.filter(s => s.tier === 'premium').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input value={form.discordId} onChange={e => setForm({ ...form, discordId: e.target.value })} placeholder="Discord ID" className="input" />
        <input value={form.robloxId} onChange={e => setForm({ ...form, robloxId: e.target.value })} placeholder="Roblox ID" className="input" />
        <select value={form.expires} onChange={e => setForm({ ...form, expires: e.target.value })} className="input">
          <option value="unlimited">Unlimited</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
          <option value="1m">1 Month</option>
        </select>
        <button onClick={add} className="btn-primary">Whitelist User</button>
      </div>

      <div className="space-y-2">
        {list.map(w => (
          <div key={w.id} className="card flex justify-between items-center">
            <div>
              <p className="text-sm">Discord: <span className="text-white">{w.discord_id}</span></p>
              <p className="text-sm">Roblox: <span className="text-white">{w.roblox_id}</span></p>
              <p className="text-xs text-gray-400">Expires: {w.expires_at || 'Never'}</p>
            </div>
            <button onClick={() => remove(w.id)} className="btn-danger">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
