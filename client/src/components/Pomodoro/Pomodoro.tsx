import { Swal } from './Swal'
import { Controls } from './Controls'
import { Display } from './Display'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SWITCH_SESSION } from '../../store/pomodoro'
import { Box } from '@mui/material'
import { useTimer } from '../../hooks/useTimer'
import { useEffect } from 'react'

type Props = {
  onClose: () => void
}

export const Pomodoro = ({ onClose }: Props) => {
  const dispatch = useAppDispatch()
  const { pomodoro } = useAppSelector((state) => ({
    pomodoro: state.pomodoro
  }))
  useTimer()

  const startNextSession = () => {
    dispatch(SWITCH_SESSION())
  }

  useEffect(() => {
    Swal(pomodoro, () => onClose(), startNextSession)
  }, [pomodoro, onClose])

  return (
    <Box sx={{ p: 2 }}>
      <Display />
      <Controls />
    </Box>
  )
}
