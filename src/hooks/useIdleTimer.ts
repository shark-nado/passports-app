import { useEffect, useRef, useCallback } from 'react'

export function useIdleTimer(callback: () => void, timeoutMs: number, active: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(callback, timeoutMs)
  }, [callback, timeoutMs])

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    reset()

    const events = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove']
    for (const ev of events) {
      window.addEventListener(ev, reset)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      for (const ev of events) {
        window.removeEventListener(ev, reset)
      }
    }
  }, [active, reset])
}
