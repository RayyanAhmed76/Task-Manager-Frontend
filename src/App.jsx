import React, { useEffect, useState } from 'react'
import { api } from './api/client'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.me().then(data=>{
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function onLogout() {
    await api.logout()
    setUser(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return user ? <Dashboard user={user} onLogout={onLogout} /> : <Auth onAuthed={setUser} />
}
