import Settings from '@mui/icons-material/Settings'
import Person from '@mui/icons-material/Person'
import Chat from '@mui/icons-material/Chat'
import { FilterTasks } from './FilterTasks'
import { ProjectSettings } from './Settings'
import { ProjStats } from './Statistics'
import { ShareProject } from './Share'
import { IconButton, List, Tooltip, useTheme } from '@mui/material'
import FilterList from '@mui/icons-material/FilterList'
import { memo, useState } from 'react'
import Equalizer from '@mui/icons-material/Equalizer'
import { TProject } from '../../types/project'
import { Pomodoro } from '../Pomodoro/Pomodoro'
import Timer from '@mui/icons-material/Timer'
import { Socket } from 'socket.io-client'
import { ProjectChat } from './Chat'

const listItems = [
  { title: 'Chat', Icon: Chat },
  { title: 'Settings', Icon: Settings },
  { title: 'Members', Icon: Person },
  { title: 'Filter', Icon: FilterList },
  { title: 'Statistics', Icon: Equalizer },
  { title: 'Pomodoro', Icon: Timer }
]

export const Sidebar = memo(
  ({ project, socket }: { project: TProject; socket: Socket }) => {
    const [open, setOpen] = useState(null as null | string)
    const theme = useTheme()

    return (
      <div
        style={{
          backgroundColor: theme.palette.background.paper,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))' // todo: light mode
        }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          <List style={{ flexDirection: 'column', display: 'flex' }}>
            {listItems.map(({ title, Icon }, i) => (
              <Tooltip placement="right" key={i} title={title}>
                <div
                  style={{
                    padding: 8,
                    borderLeft:
                      open === title
                        ? '2px solid ' + theme.palette.text.primary
                        : undefined
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setOpen((prev) => (prev === title ? null : title))
                    }
                    style={{
                      width: 48,
                      height: 48,
                      marginLeft: open === title ? -2 : undefined
                    }}
                  >
                    <Icon
                      style={{
                        width: 28,
                        height: 28,
                        color:
                          open === title
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary
                      }}
                    />
                  </IconButton>
                </div>
              </Tooltip>
            ))}
          </List>
          <div
            style={{
              backgroundColor: theme.palette.background.paper,
              height: '100%',
              maxWidth: 400,
              borderLeft: open
                ? '1px solid ' + theme.palette.divider
                : undefined
            }}
          >
            <ProjectChat
              users={project.users}
              socket={socket}
              chatId={project.chatId}
              open={open === 'Chat'}
            />
            {open === 'Filter' ? (
              <FilterTasks />
            ) : open === 'Members' ? (
              <ShareProject project={project} />
            ) : open === 'Settings' ? (
              <ProjectSettings projectId={project.id} />
            ) : open === 'Statistics' ? (
              <ProjStats project={project} />
            ) : open === 'Pomodoro' ? (
              <Pomodoro onClose={() => setOpen(null)} />
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)
