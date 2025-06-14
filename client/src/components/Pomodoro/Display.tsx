import { Button, Paper, Stack, Typography, useTheme, Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getAllTasks, id, toDaysHHMMSS } from '../../utils/utils'
import { useMemo } from 'react'
import {
  PAUSE_TIMER,
  TOGGLE_SELECTING_TASK,
  TOGGLE_TIMER
} from '../../store/pomodoro'
import { Circle } from '../../utils/Circle'
import { getDisplayTimeLeft } from '../../hooks/useTimer'

export const Display = () => {
  const { pomodoro, projects } = useAppSelector((state) => ({
    pomodoro: state.pomodoro,
    projects: state.projects
  }))

  const dispatch = useAppDispatch()
  const theme = useTheme()

  const tasks = useMemo(() => getAllTasks(projects), [projects])

  const buttonText = `${pomodoro.isPaused ? 'Start' : 'Stop'} ${
    !pomodoro.isBreak ? 'Work' : 'Break'
  }`

  const totalSeconds = !pomodoro.isBreak
    ? pomodoro.workDurationSec
    : pomodoro.breakDurationSec

  const percentLeft = ((pomodoro.timeLeftMs ?? 0) / (totalSeconds * 1000)) * 100

  const progressColor = !pomodoro.isBreak
    ? theme.palette.error.main
    : theme.palette.success.main

  return (
    <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
      <Circle
        progress={percentLeft}
        text={getDisplayTimeLeft(pomodoro)}
        showPercentageSymbol={false}
        progressColor={progressColor}
        textColor={progressColor}
        bgColor={undefined}
        textStyle={{ fontSize: 80 }}
      />
      <Paper
        sx={{
          p: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {pomodoro.selectingTask
              ? 'Selecting Task...'
              : pomodoro.selectedTaskId
              ? tasks[id(tasks, pomodoro.selectedTaskId!)].name
              : 'Select Task'}
          </Typography>
          {pomodoro.selectedTaskId && !pomodoro.selectingTask && (
            <Typography variant="caption" color="text.secondary">
              {toDaysHHMMSS(
                Math.floor(
                  (tasks[id(tasks, pomodoro.selectedTaskId)]?.workedOnMs || 0) /
                    1000
                )
              )}
            </Typography>
          )}
        </Box>
        <Button
          color="secondary"
          variant="text"
          onClick={() => {
            dispatch(PAUSE_TIMER())
            dispatch(TOGGLE_SELECTING_TASK())
          }}
          sx={{ flexShrink: 0, ml: 1 }}
        >
          {pomodoro.selectingTask
            ? 'Cancel'
            : pomodoro.selectedTaskId
            ? 'New'
            : 'Select'}
        </Button>
      </Paper>
      <Button
        onClick={() => dispatch(TOGGLE_TIMER())}
        color={'primary'}
        fullWidth
        variant="contained"
        size="large"
      >
        {buttonText}
      </Button>
    </Stack>
  )
}
