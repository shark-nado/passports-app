import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { t } from '../../services/translations'

const LOCATIONS = [
  { id: 'csc' as const, name: 'CSC', icon: 'home', desc: 'Central Service Center' },
  { id: 'bookstore' as const, name: 'Bookstore', icon: 'book', desc: 'UCSD Bookstore Location' },
]

export default function LocationSelect() {
  const navigate = useNavigate()
  const { currentLanguage, setKioskLocation } = useApp()

  const handleCheckin = (locId: string) => {
    setKioskLocation(locId as 'csc' | 'bookstore')
    navigate(`/kiosk/${locId}`)
  }

  return (
    <div className="layout-main" id="main-content" role="main">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="row">
          <div className="col-sm-12 text-center" style={{ marginBottom: '2.5rem' }}>
            <h1 className="page-header" style={{ border: 'none', margin: 0 }}>
              UC San Diego Passports
            </h1>
            <p className="lead" style={{ maxWidth: 500, margin: '0.5rem auto 0' }}>
              Visitor check-in and queue management for Passport Services.
              Check in at the kiosk or use your phone.
            </p>
          </div>
        </div>

        <div className="row">
          {LOCATIONS.map(loc => (
            <div key={loc.id} className="col-sm-6" style={{ marginBottom: '2rem' }}>
              <div
                className="panel panel-primary"
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => handleCheckin(loc.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') handleCheckin(loc.id) }}
              >
                <div className="panel-heading" style={{ padding: '2.5rem 2rem 1.5rem' }}>
                  <span className={`glyphicon glyphicon-${loc.icon}`}
                    style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}></span>
                  <h3 className="panel-title" style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t('checkin.at', { location: loc.name }, currentLanguage)}
                  </h3>
                </div>
                <div className="panel-body">
                  <p style={{ color: '#6B7C96', margin: 0 }}>{loc.desc}</p>
                  <button className="btn btn-primary btn-lg" style={{ marginTop: '1rem', minWidth: 200 }}>
                    <span className="glyphicon glyphicon-log-in" style={{ marginRight: 8 }}></span>
                    Check In
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-sm-12 text-center">
            <hr style={{ maxWidth: 200, margin: '2rem auto', borderColor: '#ddd' }} />
            <a
              href="/dashboard/login"
              className="btn btn-default btn-lg"
              onClick={e => { e.preventDefault(); navigate('/dashboard/login') }}
            >
              <span className="glyphicon glyphicon-lock" style={{ marginRight: 8 }}></span>
              {t('dashboard.link', undefined, currentLanguage)}
              <span className="glyphicon glyphicon-chevron-right" style={{ marginLeft: 8, fontSize: '0.8rem' }}></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
