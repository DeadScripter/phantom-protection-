import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Dashboard/Sidebar'
import ScriptUsage from '../components/Dashboard/ScriptUsage'
import ScriptStorage from '../components/Dashboard/ScriptStorage'
import KeySystem from '../components/Dashboard/KeySystem'
import Support from '../components/Dashboard/Support'

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="usage" element={<ScriptUsage />} />
          <Route path="storage" element={<ScriptStorage />} />
          <Route path="keys" element={<KeySystem />} />
          <Route path="support" element={<Support />} />
        </Routes>
      </main>
    </div>
  )
}
