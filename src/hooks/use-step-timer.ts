import type { StepTimerAlarmHandle } from '#/utils/step-timer-alarm'
import { startStepTimerAlarmLoop } from '#/utils/step-timer-alarm'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useStepTimer(durationMinutes: number, stepKey: string | number) {
  const totalSeconds = Math.max(0, Math.round(Number(durationMinutes) * 60))
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const [alarmRinging, setAlarmRinging] = useState(false)
  const alarmRef = useRef<StepTimerAlarmHandle | null>(null)

  const stopAlarm = useCallback(() => {
    alarmRef.current?.stop()
    alarmRef.current = null
    setAlarmRinging(false)
  }, [])

  useEffect(() => {
    stopAlarm()
    setRemaining(totalSeconds)
    setRunning(false)
  }, [stepKey, totalSeconds, stopAlarm])

  useEffect(() => {
    return () => {
      alarmRef.current?.stop()
      alarmRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 0) return 0
        const next = r - 1
        if (next === 0) {
          const handle = startStepTimerAlarmLoop()
          if (handle) {
            alarmRef.current?.stop()
            alarmRef.current = handle
          }
          setAlarmRinging(true)
          setRunning(false)
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const handlePlay = useCallback(() => {
    if (totalSeconds === 0) return
    stopAlarm()
    setRemaining((r) => (r <= 0 ? totalSeconds : r))
    setRunning(true)
  }, [totalSeconds, stopAlarm])

  const handleStopTimer = useCallback(() => {
    setRunning(false)
    setRemaining(totalSeconds)
  }, [totalSeconds])

  return {
    totalSeconds,
    remaining,
    running,
    alarmRinging,
    stopAlarm,
    handlePlay,
    handleStopTimer,
  }
}
