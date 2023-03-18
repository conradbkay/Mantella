import { useEffect } from 'react'
import { connect } from 'react-redux'
import { toggleTimerA, tickA } from '../../store/actions/pomodoro'
import { toDaysHHMMSS } from '../../utils/utilities'
import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { Stopwatch } from './Stopwatch'
import { TState } from '../../types/state'
import { getProjectIdFromTaskId, getAllTasks } from '../../utils/utilities'

type ActionCreators = typeof actionCreators

interface TProps extends ReturnType<typeof mapState>, ActionCreators {
  onClose: () => void
}

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

const CPomodoro = ({
  onClose,
  pomodoro,
  tick,
  projects,
  toggleTimer
}: TProps) => {
  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      if (!pomodoro.paused) {
        if (pomodoro.selectedTaskId && pomodoro.working) {
          tick({
            taskId: pomodoro.selectedTaskId,
            projectId: getProjectIdFromTaskId(projects, pomodoro.selectedTaskId)
          })
        } else {
          tick({})
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
    toggleTimer()
  }

  const time = toDaysHHMMSS(pomodoro.currSeconds)

  Swal(pomodoro, onClose, () => toggleWorking())

  return (
    <div style={{ minWidth: 400 }}>
      <Display toggleWorking={() => toggleWorking()} timeLeft={time} />
      <Controls />
      <Stopwatch />
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
