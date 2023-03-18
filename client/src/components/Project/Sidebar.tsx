import Settings from '@mui/icons-material/Settings'
import Person from '@mui/icons-material/Person'
import Chat from '@mui/icons-material/Chat'
import Calendar from '@mui/icons-material/CalendarMonth'
import { FilterTasks } from './FilterTasks'
import { ProjectSettings } from './ProjectSettings'
import { ProjStats } from './Statistics'
import { ShareProject } from './ShareProject'
import { Drawer, IconButton, List, Tooltip } from '@mui/material'
import FilterList from '@mui/icons-material/FilterList'
import { useState } from 'react'
import Equalizer from '@mui/icons-material/Equalizer'
import { TProject } from '../../types/project'
import { Pomodoro } from '../Pomodoro/Pomodoro'
import Timer from '@mui/icons-material/Timer'

const listItems = [
  { title: 'Chat', Icon: Chat },
  { title: 'Calendar', Icon: Calendar },
  { title: 'Settings', Icon: Settings },
  { title: 'Members', Icon: Person },
  { title: 'Filter', Icon: FilterList },
  { title: 'Statistics', Icon: Equalizer },
  { title: 'Pomodoro', Icon: Timer }
]

export const Sidebar = ({ project }: { project: TProject }) => {
  const [open, setOpen] = useState(null as null | string)

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        style: {
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #EEEEEE',
          position: 'relative'
        }
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <List style={{ flexDirection: 'column', display: 'flex', padding: 8 }}>
          {listItems.map(({ title, Icon }, i) => (
            <Tooltip placement="right" key={i} title={title}>
              <IconButton
                onClick={() =>
                  setOpen((prev) => (prev === title ? null : title))
                }
                style={{ margin: '8px 0', width: 48, height: 48 }}
              >
                <Icon style={{ width: 28, height: 28 }} />
              </IconButton>
            </Tooltip>
          ))}
        </List>
        <div style={{ backgroundColor: 'white', height: '100%' }}>
          {open === 'Filter' ? (
            <FilterTasks />
          ) : open === 'Members' ? (
            <ShareProject project={project} />
          ) : open === 'Settings' ? (
            <ProjectSettings projectId={project.id} />
          ) : open === 'Calendar' ? (
            <div>hi</div>
          ) : open === 'Chat' ? (
            <div>chat </div>
          ) : open === 'Statistics' ? (
            <ProjStats project={project} />
          ) : open === 'Pomodoro' ? (
            <Pomodoro />
          ) : null}
        </div>
      </div>
    </Drawer>
  )
}
