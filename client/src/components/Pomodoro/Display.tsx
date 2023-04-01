import { Button, Paper } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getAllTasks, id, toDaysHHMMSS } from '../../utils/utilities'
import { useMemo } from 'react'
import { TOGGLE_SELECTING_TASK, TOGGLE_TIMER } from '../../store/pomodoro'

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
        <p style={{ fontWeight: 500, marginTop: 4 }}>
          {pomodoro.selectedTaskId && !pomodoro.selectingTask
            ? toDaysHHMMSS(
                tasks[id(tasks, pomodoro.selectedTaskId)].timeWorkedOn
              )
            : ''}
        </p>
      </Paper>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => dispatch(TOGGLE_TIMER())}
          color="primary"
          fullWidth
          variant="outlined"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
