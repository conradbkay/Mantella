import { Button, Paper } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getAllTasks, id } from '../../utils/utilities'
import { useMemo } from 'react'
import {
  RESET_POMODORO,
  TOGGLE_SELECTING_TASK,
  TOGGLE_STOPWATCH
} from '../../store/pomodoro'

type Props = {
  toggleWorking: () => void
  timeLeft: string
}

export const Display = ({ timeLeft }: Props) => {
  const { pomodoro, projects } = useAppSelector((state) => ({
    pomodoro: state.pomodoro,
    projects: state.projects
  }))

  const dispatch = useAppDispatch()

  const tasks = useMemo(() => getAllTasks(projects), [projects])

  const buttonText = `${pomodoro.paused ? 'Start' : 'Stop'} ${
    pomodoro.working ? 'Work' : 'Break'
  }`
  return (
    <div style={{ margin: 10 }}>
      <div
        style={{
          color: pomodoro.working ? 'red' : 'green',
          textAlign: 'center',
          fontSize: 24
        }}
      >
        {timeLeft}
      </div>
      <Paper
        style={{
          minHeight: 36,
          marginBottom: 10,
          marginTop: 5,
          padding: 10
        }}
      >
        <p style={{ display: 'inline', fontSize: 20 }}>
          {
            pomodoro.selectingTask
              ? 'Selecting Task...'
              : pomodoro.selectedTaskId
              ? tasks[id(tasks, pomodoro.selectedTaskId!)].name
              : 'Select Task'
            /* ? tasks[pomodoro.selectedTaskId].name : 'No Task Selected'} */
          }
        </p>
        <Button
          color="secondary"
          style={{ float: 'right', marginLeft: 5 }}
          onClick={() => dispatch(TOGGLE_SELECTING_TASK())}
        >
          {pomodoro.selectingTask
            ? 'Cancel'
            : 'Select ' + (pomodoro.selectedTaskId ? 'New' : '')}
        </Button>
        <p>
          {pomodoro.selectedTaskId && !pomodoro.selectingTask
            ? '' // toDaysHHMMSS(tasks[pomodoro.selectedTaskId].timeWorkedOn)
            : ''}
        </p>
      </Paper>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => dispatch(TOGGLE_STOPWATCH())}
          color="primary"
          fullWidth
          variant="outlined"
        >
          {buttonText}
        </Button>
        <div style={{ width: 8 }} />
        <Button
          onClick={() => dispatch(RESET_POMODORO())}
          color="secondary"
          fullWidth
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
