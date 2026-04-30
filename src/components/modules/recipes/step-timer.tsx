import { Button } from '#/components/ui/button'
import type { StepTimerAlarmHandle } from '#/lib/step-timer-alarm'
import { startStepTimerAlarmLoop } from '#/lib/step-timer-alarm'
import { Clock, Play, Square, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  /** Step length in minutes (fractional allowed). */
  durationMinutes: number
  /** Change when the recipe step changes so the timer resets. */
  stepKey: string | number
  className?: string
  /** Larger controls + text for cooking mode. */
  size?: 'default' | 'lg'
}

function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function StepTimer({ durationMinutes, stepKey, className, size = 'default' }: Props) {
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

  if (totalSeconds === 0) return null

  const isLg = size === 'lg'
  const timeClass = isLg
    ? 'text-2xl font-semibold tabular-nums tracking-tight'
    : 'text-sm font-medium tabular-nums'

  return (
    <div
      className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/30 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 ${alarmRinging ? 'border-destructive/60 bg-destructive/5' : ''} ${className ?? ''}`}
      role="timer"
      aria-live="polite"
      aria-label={
        alarmRinging
          ? 'Timer finished, alarm playing'
          : `Step timer ${formatMmSs(remaining)} remaining`
      }
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Clock
          className={`shrink-0 ${alarmRinging ? 'text-destructive' : 'text-muted-foreground'} ${isLg ? 'size-6' : 'size-4'}`}
          aria-hidden
        />
        <span
          className={`min-w-[5ch] ${alarmRinging ? 'text-destructive' : 'text-foreground'} ${timeClass}`}
        >
          {formatMmSs(remaining)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {alarmRinging ? (
          <Button
            type="button"
            variant="destructive"
            size={isLg ? 'default' : 'sm'}
            className="gap-1.5"
            onClick={stopAlarm}
            aria-label="Stop alarm"
          >
            <VolumeX className="size-3.5" />
            Stop alarm
          </Button>
        ) : running ? (
          <Button
            type="button"
            variant="secondary"
            size={isLg ? 'default' : 'sm'}
            className="gap-1.5"
            onClick={handleStopTimer}
            aria-label="Stop timer and reset"
          >
            <Square className="size-3.5 fill-current" />
            Stop
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            size={isLg ? 'default' : 'sm'}
            className="gap-1.5"
            onClick={handlePlay}
            aria-label="Start timer"
          >
            <Play className="size-3.5 fill-current" />
            Play
          </Button>
        )}
      </div>
    </div>
  )
}
