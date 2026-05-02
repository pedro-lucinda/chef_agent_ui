export interface StepTimerAlarmHandle {
  stop: () => void
}

/**
 * Repeating alarm until {@link StepTimerAlarmHandle.stop} is called (Web Audio API).
 */
export function startStepTimerAlarmLoop(): StepTimerAlarmHandle | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null

  const ctx = new Ctor()
  let intervalId: number | null = null
  let stopped = false

  const playBurst = () => {
    if (stopped) return
    const beep = (when: number, freq: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, when)
      gain.gain.linearRampToValueAtTime(0.2, when + 0.02)
      gain.gain.linearRampToValueAtTime(0, when + 0.2)
      osc.start(when)
      osc.stop(when + 0.22)
    }
    const t0 = ctx.currentTime
    beep(t0, 880)
    beep(t0 + 0.22, 1040)
    beep(t0 + 0.44, 880)
  }

  void ctx.resume().then(() => {
    if (stopped) return
    playBurst()
    intervalId = window.setInterval(() => {
      if (stopped) return
      playBurst()
    }, 1100)
  })

  return {
    stop: () => {
      stopped = true
      if (intervalId != null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
      void ctx.close()
    },
  }
}
