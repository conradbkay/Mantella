import Equalizer from '@mui/icons-material/Equalizer'
import FilterList from '@mui/icons-material/FilterList'
import Send from '@mui/icons-material/Send'
import Settings from '@mui/icons-material/Settings'
import { AppBar, Toolbar, IconButton } from '@mui/material'
import { input } from './styles'
import DraggableAvatar from './Task/DraggableAvatar'
import { memo, useState } from 'react'
import { TProject } from '../../types/project'
import { useDroppable } from '@dnd-kit/core'
import { FilterTasks } from './FilterTasks'
import { ProjectSettings } from './ProjectSettings'
import { ProjStats } from './Statistics'
import { ShareProject } from './ShareProject'
import { useDispatch, useSelector } from 'react-redux'
import { setProjectA } from '../../store/actions/project'
import { TState } from '../../types/state'
import { setFilterA } from '../../store/actions/filter'

type Props = {
  project: TProject
}

const ProjectHeader = memo(
  ({ project }: Props) => {
    //const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [name, setName] = useState(project ? project.name : undefined)

    const [settings, setSettings] = useState(false)
    const [sharing, setSharing] = useState(false)
    const [stats, setStats] = useState(false)
    const [filtering, setFiltering] = useState(false)

    const dispatch = useDispatch()

    const filterData = useSelector((state: TState) => state.filter)

    /*useEffect(() => {
      window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      })

      return () =>
        window.removeEventListener('resize', () => {
          setWindowWidth(window.innerWidth)
        })
    }, [])*/

    const { setNodeRef } = useDroppable({ id: 'users' })

    return (
      <>
        <AppBar color="default" position="static">
          <Toolbar>
            <input
              style={{ ...input, width: /*`${windowWidth - 300}px`*/ 200 }}
              value={name}
              onBlur={() =>
                dispatch(
                  setProjectA({
                    id: project.id,
                    newProj: { ...project, name: name || 'newname' }
                  })
                )
              }
              onChange={(e: any) => setName(e.target.value)}
            />
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              <div ref={setNodeRef}>
                <div
                  style={{
                    display: 'flex'
                  }}
                >
                  {project.users.map((user, i) => (
                    <DraggableAvatar user={user} key={user.id} />
                  ))}
                </div>
              </div>
              <IconButton onClick={() => setFiltering(true)}>
                <FilterList />
              </IconButton>
              <IconButton
                onClick={() => setSettings(true)}
                style={{ marginLeft: 8 }}
              >
                <Settings />
              </IconButton>
              <IconButton
                onClick={() => setStats(true)}
                style={{ marginLeft: 8 }}
              >
                <Equalizer />
              </IconButton>
              <IconButton
                onClick={() => setSharing(true)}
                style={{ marginLeft: 8 }}
              >
                <Send />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <FilterTasks
          open={filtering}
          filterData={filterData}
          changeFilter={(newFilter) => dispatch(setFilterA(newFilter))}
          handleClose={() => setFiltering(false)}
        />
        <ProjStats
          projectId={project.id}
          open={stats}
          handleClose={() => setStats(false)}
        />
        <ProjectSettings
          open={settings}
          projectId={project.id}
          onClose={() => setSettings(false)}
        />
        <ShareProject
          open={sharing}
          projectId={project.id}
          onClose={() => setSharing(false)}
        />
      </>
    )
  },
  (oldProps, newProps) => {
    const same =
      oldProps.project.users === newProps.project.users &&
      oldProps.project.name === newProps.project.name

    return same
  }
)

export default ProjectHeader
