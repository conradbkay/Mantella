import { AppBar, Toolbar } from '@mui/material'
import { input } from './styles'
import DraggableAvatar from './Task/DraggableAvatar'
import { memo, useState } from 'react'
import { TProject } from '../../types/project'
import { useDroppable } from '@dnd-kit/core'

import { useDispatch } from 'react-redux'
import { setProjectA } from '../../store/actions/project'
import { APIEditProject } from '../../API/project'

type Props = {
  project: TProject
  deleteMode: boolean // when dragging a task, whole header becomes a trash can
}

const ProjectHeader = memo(
  ({ project }: Props) => {
    //const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [name, setName] = useState(project ? project.name : undefined)

    const dispatch = useDispatch()

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
              onBlur={() => {
                dispatch(
                  setProjectA({
                    id: project.id,
                    newProj: { ...project, name: name || 'newname' }
                  })
                )

                APIEditProject(project.id, { name: name || 'newname' })
              }}
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
            </div>
          </Toolbar>
        </AppBar>
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
