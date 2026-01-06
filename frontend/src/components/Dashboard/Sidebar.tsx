import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiCode, FiBarChart2, FiKey, FiLifeBuoy } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/dashboard/usage', label: 'Script Usage', icon: <FiBarChart2 /> },
  { to: '/dashboard/storage', label: 'Script Storage', icon: <FiCode /> },
  { to: '/dashboard/keys', label: 'Key System', icon: <FiKey /> },
  { to: '/dashboard/support', label: 'Support', icon: <FiLifeBuoy /> },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { logout } = useAuth()

  return (
    <>
      <button onClick={() => setOpen(!open)} className="lg:hidden p-4">
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside className={`${open ? 'block' : 'hidden'} lg:block w-64 bg-gray-800 p-4 space-y-4`}>
        <h1 className="text-xl font-bold">Phantom Protection</h1>
        <nav className="space-y-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 p-2 rounded ${pathname.startsWith(l.to) ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="btn-danger w-full mt-8">Logout</button>
      </aside>
    </>
  )
}
