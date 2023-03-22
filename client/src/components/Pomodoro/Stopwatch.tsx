import { useEffect } from 'react'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { toDaysHHMMSS } from '../../utils/utilities'
import {
  tickStopwatchA,
  toggleStopwatchA,
  resetStopwatchA
} from '../../store/actions/pomodoro'
import { Button, useTheme } from '@mui/material'
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'

type ActionCreators = typeof actionCreators

interface Props extends ReturnType<typeof mapState>, ActionCreators {}

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

const CStopwatch = (props: Props) => {
  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      if (!props.stopWatch.paused) {
        props.tickStopwatch()
      }
    }, 1000)
  })

  const theme = useTheme()

  const { stopWatch, reset } = props
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
        <Button onClick={() => reset()} style={{ marginRight: 4 }}>
          Reset
        </Button>
        <Button onClick={props.toggleStopwatch} color="secondary">
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

const mapState = (state: TState) => ({
  stopWatch: state.pomodoro.stopWatch
})

const actionCreators = {
  tickStopwatch: tickStopwatchA,
  toggleStopwatch: toggleStopwatchA,
  reset: resetStopwatchA
}

export const Stopwatch = connect(mapState, actionCreators)(CStopwatch)
