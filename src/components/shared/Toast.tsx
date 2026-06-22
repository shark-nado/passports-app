import { useEffect, useState, useCallback } from 'react'

interface ToastMessage {
  id: number
  text: string
  subtext: string
  warning?: boolean
}

let toastId = 0
const listeners: Set<(msg: ToastMessage) => void> = new Set()

export function showToast(text: string, subtext: string, warning = false) {
  const msg: ToastMessage = { id: ++toastId, text, subtext, warning }
  listeners.forEach(fn => fn(msg))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts(prev => [...prev, msg])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== msg.id))
    }, 5000)
  }, [])

  useEffect(() => {
    listeners.add(addToast)
    return () => { listeners.delete(addToast) }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 350,
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className={`alert ${t.warning ? 'alert-warning' : 'alert-info'} alert-dismissable`}
          role="alert"
          style={{ margin: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease' }}
        >
          <button type="button" className="close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
            &times;
          </button>
          <strong>{t.text}</strong>
          <br />
          <span style={{ fontSize: '0.9rem' }}>{t.subtext}</span>
        </div>
      ))}
    </div>
  )
}
