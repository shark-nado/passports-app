import { useEffect, useRef, useCallback } from 'react'

interface SSEOptions {
  location: string
  token: string
  onEvent: (event: string, data: unknown) => void
  enabled?: boolean
}

export function useSSE({ location, token, onEvent, enabled = true }: SSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const url = `/events?location=${encodeURIComponent(location)}&token=${encodeURIComponent(token)}`
    const es = new EventSource(url)
    eventSourceRef.current = es

    es.addEventListener('connected', () => {
      console.log('SSE connected')
    })

    es.addEventListener('checkin', (e) => {
      try {
        const data = JSON.parse(e.data)
        onEventRef.current('checkin', data)
      } catch { /* ignore parse errors */ }
    })

    es.addEventListener('status_update', (e) => {
      try {
        const data = JSON.parse(e.data)
        onEventRef.current('status_update', data)
      } catch { /* ignore */ }
    })

    es.onerror = () => {
      console.warn('SSE connection error, will auto-reconnect')
    }

    return es
  }, [location, token])

  useEffect(() => {
    if (!enabled || !location || !token) return
    const es = connect()
    return () => es.close()
  }, [enabled, location, token, connect])
}
