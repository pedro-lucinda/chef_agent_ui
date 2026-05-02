import { Button } from '#/components/ui/button'
import { useStepTimer } from '#/hooks/use-step-timer'
import { formatStepTimerMmSs } from '#/utils/step-timer-format'
import { Clock, Play, Square, VolumeX } from 'lucide-react'

interface Props {
  /** Step length in minutes (fractional allowed). */
  durationMinutes: number
  /** Change when the recipe step changes so the timer resets. */
  stepKey: string | number
  className?: string
  /** Larger controls + text for cooking mode. */
  size?: 'default' | 'lg'
}

export function StepTimer({ durationMinutes, stepKey, className, size = 'default' }: Props) {
  const {
    totalSeconds,
    remaining,
    running,
    alarmRinging,
    stopAlarm,
    handlePlay,
    handleStopTimer,
  } = useStepTimer(durationMinutes, stepKey)

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
          : `Step timer ${formatStepTimerMmSs(remaining)} remaining`
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
          {formatStepTimerMmSs(remaining)}
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
