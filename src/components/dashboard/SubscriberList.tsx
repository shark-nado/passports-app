import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'

interface Subscriber {
  first_name: string
  last_name: string
  email: string
  phone: string
  check_in_at: string
}

export default function SubscriberList() {
  const { auth } = useApp()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  const locId = auth?.locationId || 'csc'

  const fetchAll = useCallback(async () => {
    if (!auth) return
    setLoading(true)
    try {
      const res = await fetch(`/api/visitors?location=${locId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      if (res.ok) {
        const all: any[] = await res.json()
        setSubscribers(all.filter(v => v.subscribe && v.email))
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [auth, locId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const exportCSV = () => {
    const header = 'Name,Email,Phone,Opt-In Date\n'
    const rows = subscribers.map(s =>
      `"${s.first_name} ${s.last_name}","${s.email}","${s.phone}","${new Date(s.check_in_at).toLocaleDateString()}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers_${locId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p style={{ color: '#999' }}>Loading...</p>

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="page-header" style={{ margin: 0 }}>Subscriber Directory</h2>
        <button className="btn btn-primary" onClick={exportCSV} disabled={subscribers.length === 0}>
          📥 Export CSV
        </button>
      </div>
      <p>Visitors who opted into email communications.</p>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Opt-In Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>No subscribers found.</td></tr>
            ) : subscribers.map((s, i) => (
              <tr key={i}>
                <td><strong>{s.first_name} {s.last_name}</strong></td>
                <td><code>{s.email}</code></td>
                <td>{s.phone}</td>
                <td>{new Date(s.check_in_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
