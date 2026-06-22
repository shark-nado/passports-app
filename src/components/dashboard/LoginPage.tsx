import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { t } from '../../services/translations'
import { api } from '../../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { currentLanguage, login } = useApp()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.login(password) as { token: string; location_id: string }
      login(result.token, result.location_id as 'csc' | 'bookstore')
      navigate('/dashboard/visitor-log')
    } catch {
      setError('Invalid password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout-main" id="main-content" role="main">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
              <li><a href="/" onClick={e => { e.preventDefault(); navigate('/') }}>Home</a></li>
              <li className="active">{t('dashboard.login', undefined, currentLanguage)}</li>
            </ol>

            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">{t('dashboard.login', undefined, currentLanguage)}</h3>
              </div>
              <div className="panel-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="control-label" htmlFor="password">Location Password</label>
                    <input type="password" id="password"
                      className="form-control input-lg"
                      placeholder="Enter your location's dashboard password"
                      value={password} onChange={e => setPassword(e.target.value)}
                      autoFocus />
                    <p className="help-block">Use the password for your location (CSC or Bookstore).</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <span className="glyphicon glyphicon-exclamation-sign" style={{ marginRight: 6 }}></span>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-lg btn-block"
                    disabled={loading || !password}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>

            <div className="text-center">
              <a href="/" onClick={e => { e.preventDefault(); navigate('/') }}
                className="btn btn-link">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
