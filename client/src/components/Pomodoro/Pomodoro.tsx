import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { TOGGLE_TIMER } from '../../store/pomodoro'

type Props = {
  onClose: () => void
}

export const Pomodoro = ({ onClose }: Props) => {
  const dispatch = useAppDispatch()
  const { pomodoro } = useAppSelector((state) => ({
    pomodoro: state.pomodoro
  }))

  const toggleWorking = () => {
    dispatch(TOGGLE_TIMER(Date.now()))
  }

  Swal(pomodoro, onClose, () => toggleWorking())

  return (
    <div>
      <Display toggleWorking={() => toggleWorking()} />
      <Controls />
    </div>
  )
}
