import {
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  useTheme,
  Slider,
  ListItemText
} from '@mui/material'
import { ChooseColor } from '../ChooseColor'
import { isDate, addDays } from 'date-fns'
import isBefore from 'date-fns/esm/fp/isBefore/index.js'
import { isArray } from 'lodash'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TState } from '../../types/state'
import { SET_FILTER } from '../../store/filter'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

const FilterTasksComponent = () => {
  const [custom, setCustom] = useState(false)
  const theme = useTheme()
  const dispatch = useDispatch()
  const filterData = useSelector((state: TState) => state.filter)
  return (
    <div>
      <List style={{ minWidth: 400, marginTop: 8 }}>
        <ListItem>
          <ListItemText
            primary="Filter Tasks"
            secondary="Sorted or Filtered Tasks cannot be dragged"
            style={{
              color: theme.palette.text.primary
            }}
          />
        </ListItem>
        <ListItem
          style={{
            padding: '0px 32px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ListItemText
            style={{
              padding: 8,
              color: theme.palette.text.secondary
            }}
          >
            Points
          </ListItemText>
          <Slider
            min={0}
            max={50}
            onChange={(e, val: any) => {
              dispatch(
                SET_FILTER({
                  ...filterData,
                  points: val
                })
              )
            }}
            value={filterData.points}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </ListItem>
        <ListItem>
          <ChooseColor
            color={filterData.color[0] || '#FFFFFF' /* TODO: me */}
            onChange={(color: any) => {
              dispatch(
                SET_FILTER({
                  ...filterData,
                  color: [color]
                })
              )
            }}
          />
        </ListItem>
        <FormControlLabel
          style={{
            margin: '0px auto',
            color: theme.palette.text.secondary,
            padding: '0px 16px'
          }}
          control={
            <Switch
              disableRipple
              disableTouchRipple
              checked={custom}
              onChange={() => {
                dispatch(
                  SET_FILTER({
                    ...filterData,
                    dueDate: [null, null]
                  })
                )
                setCustom(!custom)
              }}
              color="primary"
            />
          }
          label="Customized Date Range"
        />
        <ListItem>
          {!custom ? (
            <FormControl fullWidth>
              <InputLabel>Due Date</InputLabel>
              <Select
                fullWidth
                value={filterData.dueDate}
                onChange={(e) =>
                  dispatch(
                    SET_FILTER({
                      ...filterData,
                      dueDate: e.target.value as any
                    })
                  )
                }
              >
                {[
                  ['all', 'All'],
                  ['has', 'Has Due Date'],
                  ['none', 'No Due Date'],
                  ['today', 'Today'],
                  ['tomorrow', 'Tomorrow']
                ].map((set, i) => {
                  return (
                    <MenuItem key={i} value={set[0]}>
                      {set[1]}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          ) : (
            isArray(filterData.dueDate) && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    ampm={false}
                    label="Due Date"
                    value={(filterData.dueDate[0] as any) || null}
                    onChange={(date) => {
                      if (!date) {
                        dispatch(
                          SET_FILTER({
                            ...filterData,
                            dueDate: [null, filterData.dueDate[1] as any]
                          })
                        )
                      } else if (
                        !isBefore(
                          date,
                          (filterData.dueDate[1] as any) || new Date()
                        )
                      ) {
                        dispatch(
                          SET_FILTER({
                            ...filterData,
                            dueDate: [
                              date,
                              isDate(filterData.dueDate[1])
                                ? (filterData.dueDate[1] as Date)
                                : addDays(new Date(), 1)
                            ]
                          })
                        )
                      }
                    }}
                  />
                  <DateTimePicker
                    ampm={false}
                    label="Due Date"
                    value={(filterData.dueDate[1] as any) || null}
                    onChange={(date) => {
                      if (!date) {
                        dispatch(
                          SET_FILTER({
                            ...filterData,
                            dueDate: [filterData.dueDate[0] as any, null]
                          })
                        )
                      } else if (
                        !isBefore(
                          (filterData.dueDate[0] as any) || new Date(),
                          date
                        )
                      ) {
                        dispatch(
                          SET_FILTER({
                            ...filterData,
                            dueDate: [
                              isDate(filterData.dueDate[0])
                                ? (filterData.dueDate[0] as Date)
                                : addDays(new Date(), 1),
                              date
                            ]
                          })
                        )
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            )
          )}
        </ListItem>
      </List>
    </div>
  )
}

export const FilterTasks = FilterTasksComponent
