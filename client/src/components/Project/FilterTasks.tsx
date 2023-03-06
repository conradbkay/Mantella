import { TFilterData } from './types'
import {
  Drawer,
  List,
  ListItem,
  Theme,
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
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  appBarShift: {},
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  drawer: {
    minWidth: 400
  },
  drawerPaper: {},
  toolbar: theme.mixins.toolbar
}))

interface Props {
  filterData: TFilterData
  open: boolean
  changeFilter: (newFilter: TFilterData) => void
  handleClose: () => void
}

const FilterTasksComponent = (props: Props) => {
  const [custom, setCustom] = useState(false)
  const classes = useStyles()
  const { open, handleClose, filterData, changeFilter } = props
  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => handleClose()}
      >
        <List style={{ minWidth: 250, marginTop: 8 }}>
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
                changeFilter({
                  ...filterData,
                  points: val
                })
              }}
              value={props.filterData.points}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
            />
          </ListItem>
          <ListItem>
            <ChooseColor
              hasAllOption
              color={props.filterData.color}
              onChange={(color: any) => {
                changeFilter({
                  ...filterData,
                  color: color.length
                    ? color.includes('all') && color.length > 1
                      ? color.filter((c: any) => c !== 'all')
                      : color
                    : ['all']
                })
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
                  props.changeFilter({
                    ...filterData,
                    dueDate: [null, null]
                  })
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
                    props.changeFilter({
                      ...filterData,
                      dueDate: e.target.value as any
                    })
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
                        changeFilter({
                          ...filterData,
                          dueDate: [null, filterData.dueDate[1] as any]
                        })
                      } else if (
                        !isBefore(
                          date,
                          (filterData.dueDate[1] as any) || new Date()
                        )
                      ) {
                        changeFilter({
                          ...filterData,
                          dueDate: [
                            date,
                            isDate(filterData.dueDate[1])
                              ? (filterData.dueDate[1] as Date)
                              : addDays(new Date(), 1)
                          ]
                        })
                      }
                    }}
                  />
                  <DatePicker
                    includeTime
                    containerClassName="fullwidth"
                    value={(filterData.dueDate[1] as any) || undefined}
                    onChange={(date: Date | undefined) => {
                      if (!date) {
                        changeFilter({
                          ...filterData,
                          dueDate: [filterData.dueDate[0] as any, null]
                        })
                      } else if (
                        !isBefore(
                          (filterData.dueDate[0] as any) || new Date(),
                          date
                        )
                      ) {
                        changeFilter({
                          ...filterData,
                          dueDate: [
                            isDate(filterData.dueDate[0])
                              ? (filterData.dueDate[0] as Date)
                              : addDays(new Date(), 1),
                            date
                          ]
                        })
                      }
                    }}
                  />
                </div>
              )
            )}
          </ListItem>
        </List>
      </Drawer>
    </div>
  )
}

export const FilterTasks = FilterTasksComponent
