import {
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
  ListItemText
} from '@mui/material'
import { ChooseColor } from '../utils/chooseColor'
import { isDate, addDays } from 'date-fns'
import isBefore from 'date-fns/esm/fp/isBefore/index.js'
import DatePicker from 'react-widgets/DatePicker'
import { isArray } from 'lodash'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TState } from '../../types/state'
import { setFilterA } from '../../store/actions/filter'

const FilterTasksComponent = () => {
  const [custom, setCustom] = useState(false)
  const dispatch = useDispatch()
  const filterData = useSelector((state: TState) => state.filter)
  return (
    <div>
      <List style={{ minWidth: 300, marginTop: 8 }}>
        <ListItem>
          <ListItemText
            style={{
              borderRadius: 8,
              backgroundColor: '#FFFEAF',
              padding: 8
            }}
          >
            Sorted or Filtered Tasks cannot be dragged
          </ListItemText>
        </ListItem>
        <ListItem style={{ padding: '0px 32px', marginTop: 32 }}>
          <Slider
            min={0}
            max={50}
            onChange={(e, val: any) => {
              dispatch(
                setFilterA({
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
                setFilterA({
                  ...filterData,
                  color: color.length
                    ? color.includes('all') && color.length > 1
                      ? color.filter((c: any) => c !== 'all')
                      : color
                    : ['all']
                })
              )
            }}
          />
        </ListItem>
        <FormControlLabel
          style={{ margin: '0px auto' }}
          control={
            <Switch
              disableRipple
              disableTouchRipple
              checked={custom}
              onChange={() => {
                dispatch(
                  setFilterA({
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
                    setFilterA({
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
                <DatePicker
                  includeTime
                  containerClassName="fullwidth gap"
                  value={(filterData.dueDate[0] as any) || undefined}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      dispatch(
                        setFilterA({
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
                        setFilterA({
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
                <DatePicker
                  includeTime
                  containerClassName="fullwidth"
                  value={(filterData.dueDate[1] as any) || undefined}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      dispatch(
                        setFilterA({
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
                        setFilterA({
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
              </div>
            )
          )}
        </ListItem>
      </List>
    </div>
  )
}

export const FilterTasks = FilterTasksComponent
