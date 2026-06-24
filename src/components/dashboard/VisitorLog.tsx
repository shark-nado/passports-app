import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { t } from '../../services/translations'

interface Visitor {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string
  visit_type: string
  service_type: string | null
  photo_format: string | null
  app_complete: boolean | null
  checklist: string | null
  notes: string
  status: string
  check_in_at: string
  sign_out_at: string | null
}

function serviceLabel(s: string | null): string {
  switch (s) {
    case 'passports': return 'Passports'
    case 'notary': return 'Notary'
    case 'photo-only': return 'Photo Only'
    default: return 'Questions / Returning'
  }
}

const DOC_LABELS: Record<string, string> = {
  photo: 'Photo', citizenship: 'Citiz', id: 'ID', payment: 'Pay',
}

export default function VisitorLog() {
  const { auth, currentLanguage } = useApp()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [loading, setLoading] = useState(true)
  const locId = auth?.locationId || 'csc'
  const lang = currentLanguage

  const fetchVisitors = useCallback(async (showLoading = false) => {
    if (!auth) return
    if (showLoading) setLoading(true)
    try {
      const params = new URLSearchParams({ location: locId })
      if (filterDate) params.set('date', filterDate)
      if (search) params.set('search', search)
      const res = await fetch(`/api/visitors?${params}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      if (res.ok) setVisitors(await res.json())
    } catch { /* ignore */ }
    finally { if (showLoading) setLoading(false) }
  }, [auth, locId, search, filterDate])

  useEffect(() => {
    fetchVisitors(true)
    const handler = () => fetchVisitors()
    window.addEventListener('visitor-update', handler)
    return () => window.removeEventListener('visitor-update', handler)
  }, [fetchVisitors])

  const signOut = async (id: string) => {
    if (!auth) return
    await fetch(`/api/visitors/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ status: 'Signed Out' }),
    })
    fetchVisitors()
  }

  const saveNotes = async (id: string, notes: string) => {
    if (!auth) return
    await fetch(`/api/visitors/${id}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ notes: notes.slice(0, 100) }),
    })
  }

  const exportCSV = async () => {
    if (!auth) return
    const res = await fetch(`/api/visitors/export?location=${locId}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `visitors_${locId}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="page-header" style={{ margin: 0, border: 'none' }}>{t('visitorLog.title', undefined, lang)}</h2>
        <button className="btn btn-primary" onClick={exportCSV}>
          <span className="glyphicon glyphicon-download-alt" style={{ marginRight: 6 }}></span>
          {t('visitorLog.export', undefined, lang)}
        </button>
      </div>

      <div className="panel panel-default" style={{ background: '#f8f8f8', marginBottom: '1.5rem' }}>
        <div className="panel-body">
          <div className="row">
            <div className="col-sm-5">
              <input type="text" className="form-control" placeholder={t('visitorLog.search', undefined, lang)}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-sm-3">
              <input type="date" className="form-control" value={filterDate}
                onChange={e => setFilterDate(e.target.value)} />
            </div>
            <div className="col-sm-2">
              <button className="btn btn-default btn-block" onClick={() => { setSearch(''); setFilterDate('') }}>
                {t('visitorLog.clear', undefined, lang)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel panel-default">
        <table className="table table-striped table-hover" style={{ margin: 0, fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>{t('visitorLog.colVisitor', undefined, lang)}</th>
              <th style={{ width: '13%' }}>{t('visitorLog.colService', undefined, lang)}</th>
              <th style={{ width: '18%' }}>{t('visitorLog.colStatus', undefined, lang)}</th>
              <th style={{ width: '25%' }}>Docs</th>
              <th style={{ width: '12%' }}>{t('visitorLog.colNotes', undefined, lang)}</th>
              <th style={{ width: '10%' }}>{t('visitorLog.colAction', undefined, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>{t('visitorLog.loading', undefined, lang)}</td></tr>
            ) : visitors.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>{t('visitorLog.noRecords', undefined, lang)}</td></tr>
            ) : visitors.map(v => {
              const checkIn = new Date(v.check_in_at)
              const dateStr = checkIn.toLocaleDateString()
              const timeStr = checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const outStr = v.sign_out_at
                ? new Date(v.sign_out_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : null
              const cl = v.checklist ? JSON.parse(v.checklist) : {}
              const isPass = v.service_type === 'passports'

              return (
                <tr key={v.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <strong>{v.first_name} {v.last_name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6B7C96', lineHeight: 1.3 }}>{v.email || v.phone}</div>
                  </td>
                  <td>
                    <span className="label label-primary" style={{ fontSize: '0.75rem' }}>{serviceLabel(v.service_type)}</span>
                    <div style={{ fontSize: '0.7rem', color: '#6B7C96', marginTop: 2 }}>
                      {v.visit_type === 'walk-in' ? 'Walk-in' : v.visit_type === 'appointment' ? 'Appt' : 'Return'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`label ${v.status === 'Checked In' ? 'label-success' : 'label-default'}`}
                      style={{ fontSize: '0.75rem' }}>
                      {v.status}
                    </span>
                    <span style={{ color: '#6B7C96', fontSize: '0.75rem', marginLeft: 6 }}>{timeStr}</span>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{dateStr}</div>
                  </td>
                  <td>
                    {isPass ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 6px' }}>
                        {['app_complete', 'photo', 'citizenship', 'id', 'payment'].map(f => {
                          let ok: boolean | null
                          if (f === 'app_complete') { ok = v.app_complete }
                          else { ok = cl[f] ?? null }
                          const label = f === 'app_complete' ? 'App' : DOC_LABELS[f]
                          return (
                            <span key={f} style={{
                              fontSize: '0.7rem',
                              padding: '1px 4px',
                              borderRadius: 3,
                              background: ok === true ? '#dff0d8' : ok === false ? '#f2dede' : '#f5f5f5',
                              color: ok === true ? '#3c763d' : ok === false ? '#a94442' : '#999',
                              whiteSpace: 'nowrap',
                            }}>
                              {label} {ok === true ? '✓' : ok === false ? '✗' : '—'}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <span style={{ color: '#ccc', fontSize: '0.75rem' }}>N/A</span>
                    )}
                  </td>
                  <td>
                    <input type="text" className="form-control input-sm" style={{ width: 90, fontSize: '0.75rem', height: 26 }}
                      defaultValue={v.notes || ''} maxLength={100} placeholder="..."
                      onBlur={e => saveNotes(v.id, e.target.value)} />
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    {v.status === 'Checked In' ? (
                      <button className="btn btn-primary btn-xs" style={{ fontSize: '0.75rem' }} onClick={() => signOut(v.id)}>
                        {t('visitorLog.signOut', undefined, lang)}
                      </button>
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.75rem' }}>{t('visitorLog.signedOut', undefined, lang)} {outStr}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
