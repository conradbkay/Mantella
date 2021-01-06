import React from 'react'
import { TFilterData } from './Project'
import {
  Drawer,
  List,
  ListItem,
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@material-ui/core'
import { ChooseColor } from '../utils/chooseColor'
import { isDate, addDays } from 'date-fns'
import isBefore from 'date-fns/esm/fp/isBefore/index.js'
import { DateTimePicker } from 'react-widgets'

const styles = (theme: Theme) =>
  createStyles({
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
  })

type TProps = {
  filterData: TFilterData
  open: boolean
  changeFilter: (newFilter: TFilterData) => void
  handleClose: () => void
} & WithStyles<typeof styles>

const CFilterTasks = (props: TProps) => {
  const [custom, setCustom] = React.useState(false)
  const { open, classes, handleClose, filterData, changeFilter } = props
  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => handleClose()}
      >
        <List style={{ minWidth: 250 }}>
          <ListItem>
            <ChooseColor
              hasAllOption
              color={props.filterData.color}
              onChange={(color: any) => {
                changeFilter({
                  ...filterData,
                  color
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
                onChange={() => setCustom(!custom)}
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
              <div style={{ display: 'block' }}>
                <DateTimePicker
                  containerClassName="fullwidth"
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
              </div>
            )}
          </ListItem>
        </List>
      </Drawer>
    </div>
  )
}

export const FilterTasks = withStyles(styles)(CFilterTasks)
