import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { Loading } from './ui.jsx'

export function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><Loading label="Checking session…" /></div>
  if (!admin) return <Navigate to="/login" replace />
  return children
}
