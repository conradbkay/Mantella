import { setLengthA } from '../../store/actions/pomodoro'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { Button } from '@mui/material'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import { toDaysHHMMSS } from '../../utils/utilities'
import { useTheme } from '@mui/material'

type ActionCreators = typeof actionCreators

interface Props extends ReturnType<typeof mapState>, ActionCreators {}

const CControls = (props: Props) => {
  const { workTime, breakTime } = props

  const theme = useTheme()

  return (
    <>
      <div
        style={{
          textAlign: 'center',
          fontSize: 18,
          margin: 10,
          color: theme.palette.text.secondary
        }}
      >
        Break Time: {toDaysHHMMSS(breakTime)}
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => props.setLengthA({ type: 'BREAK', byMinutes: 1 })}
          color="secondary"
          style={{ width: '100%', marginLeft: 8, marginRight: 4 }}
        >
          <Add />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'BREAK', byMinutes: 1 / 6 })}
          color="secondary"
          style={{ width: '50%', marginLeft: 8, marginRight: 4 }}
        >
          <Add style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'BREAK', byMinutes: -1 / 6 })}
          color="primary"
          fullWidth
          style={{ width: '50%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'BREAK', byMinutes: -1 })}
          color="primary"
          fullWidth
          style={{ width: '100%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove />
        </Button>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 18,
          margin: 10,
          color: theme.palette.text.secondary
        }}
      >
        Work Time: {toDaysHHMMSS(workTime)}
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => props.setLengthA({ type: 'WORK', byMinutes: 5 })}
          color="secondary"
          style={{ width: '100%', marginLeft: 8, marginRight: 4 }}
        >
          <Add />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'WORK', byMinutes: 1 })}
          color="secondary"
          style={{ width: '50%', marginLeft: 8, marginRight: 4 }}
        >
          <Add style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'WORK', byMinutes: -1 })}
          color="primary"
          fullWidth
          style={{ width: '50%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() => props.setLengthA({ type: 'WORK', byMinutes: -5 })}
          color="primary"
          fullWidth
          style={{ width: '100%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove />
        </Button>
      </div>
    </>
  )
}

const mapState = (state: TState) => ({
  workTime: state.pomodoro.workSeconds,
  breakTime: state.pomodoro.breakSeconds
})

const actionCreators = {
  setLengthA
}

export const Controls = connect(mapState, actionCreators)(CControls)
