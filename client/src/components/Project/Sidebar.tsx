import Settings from '@mui/icons-material/Settings'
import Person from '@mui/icons-material/Person'
import ChatIcon from '@mui/icons-material/Chat'
import { FilterTasks } from './FilterTasks'
import { ProjectSettings } from './Settings'
import { ProjStats } from './Statistics'
import { ShareProject } from './Share'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import FilterList from '@mui/icons-material/FilterList'
import { memo, useState } from 'react'
import Equalizer from '@mui/icons-material/Equalizer'
import { TProject } from '../../types/project'
import { Pomodoro } from '../Pomodoro/Pomodoro'
import Timer from '@mui/icons-material/Timer'
import { Socket } from 'socket.io-client'
import { ChatMessages } from '../Chat/Messages'
import { Resizable } from 're-resizable'

const listItems = [
  { title: 'Chat', Icon: ChatIcon },
  { title: 'Settings', Icon: Settings },
  { title: 'Members', Icon: Person },
  { title: 'Filter', Icon: FilterList },
  { title: 'Statistics', Icon: Equalizer },
  { title: 'Pomodoro', Icon: Timer }
]

export const Sidebar = memo(
  ({ project, socket }: { project: TProject; socket: Socket | null }) => {
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
          <div
            style={{
              flexDirection: 'column',
              display: 'flex',
              padding: '8px 0'
            }}
          >
            {listItems.map(({ title, Icon }, i) => (
              <Tooltip placement="right" key={i} title={title}>
                <div
                  aria-label={undefined}
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
                    aria-label={title}
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
          </div>
          <Resizable
            defaultSize={{ width: 400, height: 'auto' }}
            minWidth={280}
            maxWidth={1000}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            style={{
              backgroundColor: theme.palette.background.paper,
              borderLeft: open
                ? '1px solid ' + theme.palette.divider
                : undefined,
              display: !open ? 'none' : undefined
            }}
          >
            <ChatMessages
              topMargin={64}
              users={project.users}
              socket={socket}
              channel={project.channels[0]}
              open={open === 'Chat'}
            />
            {open === 'Filter' ? (
              <FilterTasks project={project} />
            ) : open === 'Members' ? (
              <ShareProject project={project} />
            ) : open === 'Settings' ? (
              <ProjectSettings project={project} />
            ) : open === 'Statistics' ? (
              <ProjStats project={project} />
            ) : open === 'Pomodoro' ? (
              <Pomodoro onClose={() => setOpen(null)} />
            ) : null}
          </Resizable>
        </div>
      </div>
    )
  }
)
