import { useEffect } from 'react'
import { toDaysHHMMSS } from '../../utils/utilities'
import { Button, useTheme } from '@mui/material'
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  RESET_STOPWATCH,
  selectPomodoro,
  TICK_STOPWATCH,
  TOGGLE_STOPWATCH
} from '../../store/pomodoro'

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

export const Stopwatch = () => {
  const stopWatch = useAppSelector(selectPomodoro).stopWatch
  const dispatch = useAppDispatch()

  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      if (!stopWatch.paused) {
        dispatch(TICK_STOPWATCH())
      }
    }, 1000)
  })

  const theme = useTheme()

  return (
    <div style={{ margin: 10 }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: 28,
          marginBottom: 10,
          color: theme.palette.text.secondary
        }}
      >
        {toDaysHHMMSS(stopWatch.time)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => dispatch(RESET_STOPWATCH())}
          style={{ marginRight: 4 }}
        >
          Reset
        </Button>
        <Button onClick={() => dispatch(TOGGLE_STOPWATCH())} color="secondary">
          {stopWatch.paused ? (
            <PlayArrow style={{ marginRight: 4 }} />
          ) : (
            <Pause style={{ marginRight: 4 }} />
          )}
          {stopWatch.paused ? 'Start' : 'Stop'}
        </Button>
      </div>
    </div>
  )
}
