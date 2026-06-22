import { useNavigate, useLocation } from 'react-router-dom'
import { useApp, type Language } from '../../context/AppContext'

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'zh', label: '中文' },
  { code: 'vi', label: 'VI' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentLanguage, setLanguage, auth, logout } = useApp()

  const path = location.pathname
  const isDashboard = path.startsWith('/dashboard')
  const isKiosk = path.startsWith('/kiosk') || path.startsWith('/mobile')

  return (
    <nav className="navbar navbar-default navbar-static-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="offcanvas"
            data-target=".navmenu"
            data-canvas="body"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="col-sm-1 mobile-nav-bars">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </div>
            <div className="col-sm-1 mobile-nav-icon">MENU</div>
          </button>
          <div className="col-sm-4 pull-right visible-xs-block">
            <img
              src="https://cdn.ucsd.edu/developer/decorator/5.0.2/img/ucsd-footer-logo-white.png"
              alt="UC San Diego"
              className="img-responsive header-logo"
            />
          </div>
        </div>

        <div className="collapse navbar-collapse" id="site-nav">
          <ul className="nav navbar-nav">
            {!isDashboard && !isKiosk && (
              <>
                <li className={path === '/' ? 'active' : ''}>
                  <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a>
                </li>
              </>
            )}
            {isDashboard && auth && (
              <>
                <li className={path.includes('visitor-log') ? 'active' : ''}>
                  <a href="/dashboard/visitor-log" onClick={e => { e.preventDefault(); navigate('/dashboard/visitor-log') }}>
                    Visitor Log
                  </a>
                </li>
                <li className={path.includes('reports') ? 'active' : ''}>
                  <a href="/dashboard/reports" onClick={e => { e.preventDefault(); navigate('/dashboard/reports') }}>
                    Reports
                  </a>
                </li>
                <li className={path.includes('questions') ? 'active' : ''}>
                  <a href="/dashboard/questions" onClick={e => { e.preventDefault(); navigate('/dashboard/questions') }}>
                    Form Questions
                  </a>
                </li>
                <li>
                  <a href="/" onClick={e => { e.preventDefault(); logout(); navigate('/') }}>
                    Lock Dashboard
                  </a>
                </li>
              </>
            )}
            {isKiosk && (
              <li className="active">
                <a href="#">Check-In</a>
              </li>
            )}
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                {languages.find(l => l.code === currentLanguage)?.label || 'EN'} <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                {languages.map(l => (
                  <li key={l.code} className={currentLanguage === l.code ? 'active' : ''}>
                    <a href="#" onClick={e => { e.preventDefault(); setLanguage(l.code) }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
