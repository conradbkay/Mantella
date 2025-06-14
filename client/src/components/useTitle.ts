import { useEffect } from 'react'
import { useAppSelector } from '../store/hooks'

const defaultTitle = 'Mantella'

// pomodoro sets the title so we don't want to interfere/override it
const useTitle = (title: string) => {
  const pomodoroPaused = useAppSelector((state) => state.pomodoro.isPaused)

  useEffect(() => {
    if (pomodoroPaused) {
      document.title = title
    }
    return () => {
      if (pomodoroPaused) {
        document.title = defaultTitle
      }
    }
  })
}

export default useTitle
