import { Button } from '@mui/material'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import { toDaysHHMMSS } from '../../utils/utils'
import { useTheme } from '@mui/material'
import { selectPomodoro, SET_LENGTH_MINUTES } from '../../store/pomodoro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export const Controls = () => {
  const theme = useTheme()
  const { breakSeconds: breakTime, workSeconds: workTime } =
    useAppSelector(selectPomodoro)

  const dispatch = useAppDispatch()

  return (
    <>
      <div
        style={{
          textAlign: 'center',
          fontSize: 18,
          margin: 10,
          color: theme.palette.text.secondary
        }}
      >
        Break Time: {toDaysHHMMSS(breakTime)}
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() =>
            dispatch(SET_LENGTH_MINUTES({ operationType: 'BREAK', minutes: 1 }))
          }
          color="secondary"
          style={{ width: '100%', marginLeft: 8, marginRight: 4 }}
        >
          <Add />
        </Button>
        <Button
          onClick={() =>
            dispatch(
              SET_LENGTH_MINUTES({ operationType: 'BREAK', minutes: 1 / 6 })
            )
          }
          color="secondary"
          style={{ width: '50%', marginLeft: 8, marginRight: 4 }}
        >
          <Add style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() =>
            dispatch(
              SET_LENGTH_MINUTES({ operationType: 'BREAK', minutes: -1 / 6 })
            )
          }
          color="primary"
          fullWidth
          style={{ width: '50%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() =>
            dispatch(
              SET_LENGTH_MINUTES({ operationType: 'BREAK', minutes: -1 })
            )
          }
          color="primary"
          fullWidth
          style={{ width: '100%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove />
        </Button>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 18,
          margin: 10,
          color: theme.palette.text.secondary
        }}
      >
        Work Time: {toDaysHHMMSS(workTime)}
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() =>
            dispatch(SET_LENGTH_MINUTES({ operationType: 'WORK', minutes: 5 }))
          }
          color="secondary"
          style={{ width: '100%', marginLeft: 8, marginRight: 4 }}
        >
          <Add />
        </Button>
        <Button
          onClick={() =>
            dispatch(SET_LENGTH_MINUTES({ operationType: 'WORK', minutes: 1 }))
          }
          color="secondary"
          style={{ width: '50%', marginLeft: 8, marginRight: 4 }}
        >
          <Add style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() =>
            dispatch(SET_LENGTH_MINUTES({ operationType: 'WORK', minutes: -1 }))
          }
          color="primary"
          fullWidth
          style={{ width: '50%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove style={{ fontSize: 18 }} />
        </Button>
        <Button
          onClick={() =>
            dispatch(SET_LENGTH_MINUTES({ operationType: 'WORK', minutes: -5 }))
          }
          color="primary"
          fullWidth
          style={{ width: '100%', marginLeft: 4, marginRight: 8 }}
        >
          <Remove />
        </Button>
      </div>
    </>
  )
}
