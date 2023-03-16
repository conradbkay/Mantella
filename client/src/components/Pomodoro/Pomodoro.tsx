import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Theme, DialogTitle, IconButton, Tabs, Tab, Card } from '@mui/material'
import Close from '@mui/icons-material/Close'
import Settings from '@mui/icons-material/Settings'
import { toggleTimerA, tickA } from '../../store/actions/pomodoro'
import { toDaysHHMMSS } from '../../utils/utilities'
import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { Stopwatch } from './Stopwatch'
import { TState } from '../../types/state'
import { getProjectIdFromTaskId, getAllTasks } from '../../utils/utilities'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: 'fixed',
    bottom: theme.spacing(4),
    outline: 'none',
    left: theme.spacing(4),
    maxWidth: 700,
    minWidth: 300,
    zIndex: 1099,
    backgroundColor: '#f2f2f2'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))

type ActionCreators = typeof actionCreators

interface TProps extends ReturnType<typeof mapState>, ActionCreators {
  open: boolean
  stateFunc(next: boolean): void
}

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

const CPomodoro = (props: TProps) => {
  const [tab, setTab] = useState(0)

  const pomodoro = props.pomodoro

  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      if (!pomodoro.paused) {
        if (pomodoro.selectedTaskId && pomodoro.working) {
          props.tick({
            taskId: pomodoro.selectedTaskId,
            projectId: getProjectIdFromTaskId(
              props.projects,
              pomodoro.selectedTaskId
            )
          })
        } else {
          props.tick({})
        }
      }
      // set tab title
      document.title = pomodoro.paused
        ? 'Mantella'
        : `${pomodoro.working ? 'Work ' : 'Break '} ${toDaysHHMMSS(
            pomodoro.currSeconds - 1
          )}`
    }, 1000)
  })

  const toggleWorking = () => {
    props.toggleTimer()
  }

  const classes = useStyles()
  const { open, stateFunc } = props
  const time = toDaysHHMMSS(pomodoro.currSeconds)

  Swal(pomodoro, stateFunc, () => toggleWorking())

  return (
    <div>
      {open && (
        <Card className={classes.card}>
          <DialogTitle>Pomodoro</DialogTitle>
          <IconButton
            className={classes.closeButton}
            onClick={() => stateFunc(false)}
          >
            <Close />
          </IconButton>
          {tab === 0 && (
            <Display toggleWorking={() => toggleWorking()} timeLeft={time} />
          )}
          {tab === 1 && <Controls />}
          {tab === 2 && <Stopwatch />}
          <Tabs value={tab} onChange={(e, v: number) => setTab(v)}>
            <Tab label="Clock" />
            <Tab icon={<Settings />} />
            <Tab label="Stopwatch" />
          </Tabs>
        </Card>
      )}
    </div>
  )
}

const mapState = (state: TState) => ({
  pomodoro: state.pomodoro,
  projects: state.projects,
  tasks: getAllTasks(state.projects)
})

const actionCreators = {
  toggleTimer: toggleTimerA,
  tick: tickA
}

export const Pomodoro = connect(mapState, actionCreators)(CPomodoro)
