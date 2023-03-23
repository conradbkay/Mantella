import { useEffect } from 'react'
import { toDaysHHMMSS } from '../../utils/utilities'
import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { Stopwatch } from './Stopwatch'
import { getProjectIdFromTaskId } from '../../utils/utilities'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { TICK } from '../../store/projects'
import { TOGGLE_TIMER, TICK as POM_TICK } from '../../store/pomodoro'

type Props = {
  onClose: () => void
}

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

export const Pomodoro = ({ onClose }: Props) => {
  const { projects, pomodoro } = useAppSelector((state) => ({
    projects: state.projects,
    pomodoro: state.pomodoro
  }))

  const dispatch = useAppDispatch()

  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      if (!pomodoro.paused) {
        if (pomodoro.selectedTaskId && pomodoro.working) {
          dispatch(
            TICK({
              taskId: pomodoro.selectedTaskId,
              projectId: getProjectIdFromTaskId(
                projects,
                pomodoro.selectedTaskId
              )
            })
          )
        }
        dispatch(POM_TICK())
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
    dispatch(TOGGLE_TIMER())
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
