import { CSSProperties } from 'react'
import { TProject } from '../../types/project'
import { Select, MenuItem, IconButton, Theme } from '@mui/material'
import NavigateNext from '@mui/icons-material/NavigateNext'
import NavigateBefore from '@mui/icons-material/NavigateBefore'
import { format, addDays, subDays } from 'date-fns'
import { makeStyles } from '@mui/styles'
const mobilePx = 750

const useStyles = makeStyles((theme: Theme) => ({
  nav: {
    [theme.breakpoints.up(mobilePx)]: {
      ...boxStyle
    },
    [theme.breakpoints.down(mobilePx)]: {
      marginRight: 'auto'
    }
  }
}))

const boxStyle: CSSProperties = {
  alignItems: 'center',
  flex: 1,
  display: 'flex',
  justifyContent: 'center'
}

interface Props {
  projects: TProject[]
  toggleProject: (id: string[]) => void
  currIds: string[]
  startDay: Date
  setDate: (newDay: Date) => void
}

export const WeekControls = (props: Props) => {
  const { projects, toggleProject, currIds } = props

  const classes = useStyles()

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <Select
        style={{ maxWidth: '30%', ...boxStyle }}
        value={currIds.length === 0 ? ['-1'] : currIds}
        onChange={(e) => {
          const withoutAllProjects = (e.target.value as any).filter(
            (num: string) => num !== '-1'
          )
          toggleProject(
            // we dont want the array to ever be empty, and we dont want both the All projects and anything else to show at the same time.
            ((e as any).target.value.includes('-1') &&
              !currIds.includes('-1')) ||
              withoutAllProjects.length === 0
              ? ['-1']
              : withoutAllProjects
          )
        }}
        multiple
      >
        <MenuItem value={-1}>All Projects</MenuItem>
        {Object.values(projects).map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
      <div className={classes.nav}>
        <IconButton onClick={() => props.setDate(subDays(props.startDay, 6))}>
          <NavigateBefore />
        </IconButton>
        <span style={{ margin: '10px' }}>
          {`${format(props.startDay, 'MMM d')} - ${format(
            addDays(props.startDay, 6),
            'MMM d'
          )}`}
        </span>
        <IconButton onClick={() => props.setDate(addDays(props.startDay, 8))}>
          <NavigateNext />
        </IconButton>
      </div>
      {window.innerWidth >= mobilePx && <div style={boxStyle} />}
    </div>
  )
}
