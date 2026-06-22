import { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import ToastContainer, { showToast } from '../shared/Toast'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useApp()

  useEffect(() => {
    if (!auth) navigate('/dashboard/login', { replace: true })
  }, [auth, navigate])

  // SSE real-time notifications
  useEffect(() => {
    if (!auth) return
    const url = `/events?location=${encodeURIComponent(auth.locationId)}&token=${encodeURIComponent(auth.token)}`
    const es = new EventSource(url)
    es.addEventListener('checkin', (e) => {
      try {
        const data = JSON.parse(e.data)
        const name = `${data.first_name} ${data.last_name}`
        const hasMissing = data.app_complete === false
        if (hasMissing) {
          showToast(`⚠️ Missing Docs: ${name}`, `Checked in with missing documents.`, true)
        } else {
          showToast(`New Check-In: ${name}`, `Checked in.`)
        }
        window.dispatchEvent(new CustomEvent('visitor-update'))
      } catch { /* ignore */ }
    })
    es.addEventListener('connected', () => { console.log('SSE connected') })
    return () => es.close()
  }, [auth])

  if (!auth) return null

  const locName = auth.locationId === 'bookstore' ? 'Bookstore' : 'CSC'
  const tabs = [
    { path: '/dashboard/visitor-log', label: 'Visitor Log', icon: 'list-alt' },
    { path: '/dashboard/questions', label: 'Form Questions', icon: 'edit' },
    { path: '/dashboard/subscribers', label: 'Subscribers', icon: 'envelope' },
    { path: '/dashboard/reports', label: 'Reports', icon: 'signal' },
    { path: '/dashboard/qr', label: 'QR Code', icon: 'phone' },
  ]

  return (
    <div className="layout-main" id="main-content" role="main">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-sm-3">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{locName} Dashboard</h3>
              </div>
              <div className="panel-body" style={{ padding: 0 }}>
                <ul className="nav nav-pills nav-stacked" style={{ margin: 0 }}>
                  {tabs.map(tab => (
                    <li key={tab.path} className={location.pathname === tab.path ? 'active' : ''} style={{ margin: 0 }}>
                      <a href={tab.path} onClick={e => { e.preventDefault(); navigate(tab.path) }}
                        style={{ borderRadius: 0 }}>
                        <span className={`glyphicon glyphicon-${tab.icon}`} style={{ marginRight: 8 }}></span>
                        {tab.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center" style={{ marginTop: '0.5rem' }}>
              <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}
                className="btn btn-default btn-sm">
                ← Back to Home
              </a>
            </div>
          </div>

          {/* Main content */}
          <div className="col-sm-9">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
