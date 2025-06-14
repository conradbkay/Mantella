import { Button, Typography, Stack, ButtonGroup, Box } from '@mui/material'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import { toDaysHHMMSS } from '../../utils/utils'
import { selectPomodoro, SET_LENGTH_MINUTES } from '../../store/pomodoro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const TimeControl = ({
  label,
  time,
  onUpdate
}: {
  label: string
  time: number
  onUpdate: (minutes: number) => void
}) => (
  <Stack spacing={1} alignItems="center">
    <Typography variant="subtitle1" color="text.secondary">
      {label}: {toDaysHHMMSS(time)}
    </Typography>
    <ButtonGroup variant="outlined" aria-label={`${label} time control`}>
      <Button onClick={() => onUpdate(-5)}>
        <Remove />
      </Button>
      <Button onClick={() => onUpdate(-1)}>
        <Remove style={{ fontSize: 18 }} />
      </Button>
      <Button onClick={() => onUpdate(1)}>
        <Add style={{ fontSize: 18 }} />
      </Button>
      <Button onClick={() => onUpdate(5)}>
        <Add />
      </Button>
    </ButtonGroup>
  </Stack>
)

export const Controls = () => {
  const { breakDurationSec: breakTime, workDurationSec: workTime } =
    useAppSelector(selectPomodoro)

  const dispatch = useAppDispatch()

  const handleBreakUpdate = (minutes: number) => {
    dispatch(SET_LENGTH_MINUTES({ operationType: 'BREAK', minutes }))
  }

  const handleWorkUpdate = (minutes: number) => {
    dispatch(SET_LENGTH_MINUTES({ operationType: 'WORK', minutes }))
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ flexWrap: 'wrap', rowGap: 2 }}
      >
        <TimeControl
          label="Break Time"
          time={breakTime}
          onUpdate={handleBreakUpdate}
        />
        <TimeControl
          label="Work Time"
          time={workTime}
          onUpdate={handleWorkUpdate}
        />
      </Stack>
    </Box>
  )
}
