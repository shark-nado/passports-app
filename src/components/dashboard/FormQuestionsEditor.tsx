import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

interface Question {
  title: string
  description: string
}

interface Questions {
  [key: string]: Question
}

const DEFAULT_QUESTIONS: Questions = {
  photo: { title: 'Passport Photo', description: 'Do you have a 2x2 inch color photo taken within the last 6 months?' },
  citizenship: { title: 'Proof of Citizenship', description: 'Do you have a certified birth certificate or naturalization certificate?' },
  id: { title: 'Photo Identification', description: "Do you have a valid driver's license or government-issued ID?" },
  payment: { title: 'Form of Payment', description: 'Do you have a credit card, check, or money order for processing fees?' },
}

export default function FormQuestionsEditor() {
  const { auth } = useApp()
  const [questions, setQuestions] = useState<Questions>(DEFAULT_QUESTIONS)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchQs = async () => {
      try {
        const res = await fetch('/api/questions')
        if (res.ok) {
          const data = await res.json()
          setQuestions(data)
        }
      } catch { /* ignore */ }
    }
    fetchQs()
  }, [])

  const handleSave = async () => {
    if (!auth) return
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify(questions),
      })
      if (res.ok) {
        setMsg('Questions saved successfully.')
      } else {
        setMsg('Failed to save.')
      }
    } catch {
      setMsg('Error saving.')
    } finally {
      setSaving(false)
    }
  }

  const resetDefaults = () => {
    setQuestions(DEFAULT_QUESTIONS)
  }

  const updateQuestion = (key: string, field: 'title' | 'description', value: string) => {
    setQuestions(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  return (
    <>
      <h2 className="page-header" style={{ margin: 0 }}>Form Questions</h2>
      <p className="lead" style={{ marginTop: 0 }}>Edit the questions shown on the kiosk document checklist.</p>

      {msg && (
        <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {msg}
        </div>
      )}

      {Object.entries(questions).map(([key, q]) => (
        <div className="panel panel-default" key={key} style={{ marginBottom: '1.5rem' }}>
          <div className="panel-heading">
            <h3 className="panel-title" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {key}
            </h3>
          </div>
          <div className="panel-body">
            <div className="form-group">
              <label>Heading (shown on kiosk)</label>
              <input
                type="text"
                className="form-control"
                value={q.title}
                onChange={e => updateQuestion(key, 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description (shown under heading)</label>
              <textarea
                className="form-control"
                rows={3}
                value={q.description}
                onChange={e => updateQuestion(key, 'description', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : <><span className="glyphicon glyphicon-floppy-disk" style={{ marginRight: 6 }}></span>Save</>}
        </button>
        <button className="btn btn-default" onClick={resetDefaults}>
          Reset Defaults
        </button>
      </div>
    </>
  )
}
