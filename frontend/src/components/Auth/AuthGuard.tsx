import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ReactNode, useEffect } from 'react'

interface Props {
  children: ReactNode
}

export function AuthGuard({ children }: Props) {
  const { user, loading, fetchMe } = useAuth()

  useEffect(() => {
    fetchMe()
  }, [])

  if (loading) return <div className="p-8">Loading…</div>
  return user ? <>{children}</> : <Navigate to="/" replace />
}
