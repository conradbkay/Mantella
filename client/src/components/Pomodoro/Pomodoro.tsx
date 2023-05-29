import { toDaysHHMMSS } from '../../utils/utilities'
import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { Stopwatch } from './Stopwatch'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { TOGGLE_TIMER } from '../../store/pomodoro'

type Props = {
  onClose: () => void
}

export const Pomodoro = ({ onClose }: Props) => {
  const dispatch = useAppDispatch()

  const toggleWorking = () => {
    dispatch(TOGGLE_TIMER())
  }

  const pomodoro = useAppSelector((state) => state.pomodoro)

  const time = toDaysHHMMSS(pomodoro.currSeconds)

  Swal(pomodoro, onClose, () => toggleWorking())

  return (
    <div>
      <Display toggleWorking={() => toggleWorking()} timeLeft={time} />
      <Controls />
      <Stopwatch />
    </div>
  )
}
