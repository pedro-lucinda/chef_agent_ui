'use client'
import { cn } from '#/utils/cn'
import { motion, stagger, useAnimate } from 'motion/react'
import { useEffect, useState } from 'react'

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay,
  repeatIntervalMs,
}: {
  words: string
  className?: string
  filter?: boolean
  duration?: number
  /** Seconds to wait before the staggered reveal starts (default 0). */
  delay?: number
  /** When set, the intro animation runs again on this interval (ms). */
  repeatIntervalMs?: number
}) => {
  const [scope, animate] = useAnimate()
  const [replayKey, setReplayKey] = useState(0)
  const wordsArray = words.split(' ')

  useEffect(() => {
    if (repeatIntervalMs == null || repeatIntervalMs <= 0) return
    const id = window.setInterval(() => {
      setReplayKey((k) => k + 1)
    }, repeatIntervalMs)
    return () => window.clearInterval(id)
  }, [repeatIntervalMs])

  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2, { startDelay: delay ?? 0 }),
      },
    )
  }, [animate, delay, duration, filter, replayKey, words])

  const renderWords = () => {
    return (
      <motion.div key={replayKey} ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0 "
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {word}{' '}
            </motion.span>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className="font-bold">
      <div className="mt-4">
        <div
          className={cn(
            'text-black leading-snug tracking-wide text-2xl dark:text-white',
            className,
          )}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  )
}
