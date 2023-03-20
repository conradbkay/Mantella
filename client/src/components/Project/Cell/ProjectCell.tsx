import { ChangeEvent, CSSProperties, memo, useState } from 'react'
import { TList, TProject } from '../../../types/project'
import { BaseTask } from '../Task/Base'
import { IconButton, Menu as MuiMenu, MenuItem, useTheme } from '@mui/material'
import { id } from '../../../utils/utilities'
import Menu from '@mui/icons-material/Menu'
import Add from '@mui/icons-material/Add'
import { filterTask /*filterTasks*/ } from '../../../utils/filterTasks'
import { input } from '../styles'
import { useDroppable } from '@dnd-kit/core'
import DraggableTask from '../Task/Draggable'
import { PROJECT_BORDER, PROJECT_BORDER_COLOR } from '../Project'
import { TState } from '../../../types/state'
import { useDispatch, useSelector } from 'react-redux'
import { setListA } from '../../../store/actions/list'
import { SortableContext } from '@dnd-kit/sortable'

interface Props {
  project: TProject
  list: TList
  progress: 0 | 1 | 2
  draggingId?: string | null
  openFunc: (id: string) => void
  setCreating: (id: string) => void
}

const getCellStyles = ({
  project,
  list,
  progress,
  collapsed
}: {
  project: TProject
  list: TList
  progress: number
  collapsed: boolean
}): CSSProperties => {
  const isLastColumn = progress === 2
  const isFirstColumn = progress === 0
  const isFinalRow =
    project.lists.findIndex((projList) => projList.id === list.id) ===
    project.lists.length - 1
  return {
    borderTop: PROJECT_BORDER,
    borderRight: `1px ${
      isLastColumn ? 'solid' : 'dashed'
    } ${PROJECT_BORDER_COLOR}`,
    borderBottom: isFinalRow ? PROJECT_BORDER : undefined,
    borderBottomLeftRadius: isFinalRow && isFirstColumn ? 4 : undefined,
    borderBottomRightRadius: isFinalRow && isLastColumn ? 4 : undefined,
    borderLeft: isFirstColumn ? PROJECT_BORDER : undefined,
    width: '100%',
    padding: collapsed ? '0px 8px' : 8,
    maxHeight: collapsed ? 100 : undefined, //'60vh',
    overflowY: 'auto',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}

export const ProjectCell = memo(
  ({ project, list, progress, openFunc, draggingId, setCreating }: Props) => {
    const [anchorEl, setAnchorEl] = useState(null as HTMLElement | null)
    const [deletingList, setDeletingList] = useState(false)
    const [editingList, setEditingList] = useState(['', ''])
    const [collapsed, setCollapsed] = useState(false)

    const { filter } = useSelector((state: TState) => ({
      filter: state.filter
    }))

    const dispatch = useDispatch()

    const editList = () => {
      dispatch(
        setListA({
          id: editingList[0],
          projectId: project.id,
          newList: { name: editingList[1] }
        })
      )
      setEditingList(['', ''])
    }

    let tasks = list.taskIds[progress].map(
      (taskId) => project.tasks[id(project.tasks, taskId)]
    )
    // TODO: For now tasks cannot be dragged if tasks are filtered out
    //const isDragDisabled = tasks.length !== filterTasks(tasks, filter).length

    const editingName =
      progress === 0 && list.id === editingList[0] ? editingList[1] : ''

    const { setNodeRef } = useDroppable({ id: `${list.id}|${progress}` })

    const deleteList = () => {
      dispatch(
        setListA({
          id: list.id,
          projectId: project.id,
          newList: null
        })
      )
    }

    const theme = useTheme()

    // TODO: make background color change when dragging task, same for task changing when dragging user on
    return (
      <td
        className="anim-height"
        style={getCellStyles({ project, collapsed, list, progress })}
      >
        {progress === 0 && (
          <div style={{ display: 'flex', margin: 4 }}>
            {collapsed && (
              <h2
                style={{
                  fontSize: 16,
                  margin: 'auto 8px auto 0px',
                  color: theme.palette.text.disabled
                }}
              >
                [Collapsed]
              </h2>
            )}
            {editingName ? (
              <input
                style={{ width: '100%', ...input(theme) }}
                value={editingName}
                onBlur={() => editList()}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingList([list.id, e.target.value])
                }
              />
            ) : (
              <h2
                style={{
                  margin: 'auto 0px',
                  fontSize: 18,
                  color: theme.palette.text.secondary
                }}
              >
                {list.name}
              </h2>
            )}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              style={{
                marginLeft: 'auto',
                color: theme.palette.text.secondary
              }}
            >
              <Menu />
            </IconButton>
            {!collapsed && (
              <IconButton
                color="primary"
                style={{ marginLeft: 8 }}
                onClick={() => setCreating(list.id)}
              >
                <Add />
              </IconButton>
            )}
            <MuiMenu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setCollapsed((prev) => !prev)
                }}
              >
                {collapsed ? 'Uncollapse' : 'Collapse'}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setEditingList([list.id, list.name])
                  setAnchorEl(null)
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                disabled={project.lists.length === 1}
                onClick={() => {
                  if (deletingList && project.lists.length > 1) {
                    setAnchorEl(null)
                    deleteList()
                  } else {
                    const DOUBLE_CLICK_TIMEOUT = 4000
                    setDeletingList(true)
                    setTimeout(
                      () => setDeletingList(false),
                      DOUBLE_CLICK_TIMEOUT
                    )
                  }
                }}
              >
                {deletingList ? (
                  <div style={{ color: 'red', fontWeight: 500 }}>Confirm</div>
                ) : (
                  'Delete'
                )}
              </MenuItem>
            </MuiMenu>
          </div>
        )}
        <SortableContext
          id={`${list.id}|${progress}`}
          items={tasks}
          strategy={(() => {}) as any}
        >
          <div ref={setNodeRef} style={{ height: '100%' }}>
            <div
              style={{
                flexDirection: 'column',
                display: 'flex',
                minHeight: collapsed ? 0 : 78,
                height: '100%'
              }}
            >
              {!collapsed
                ? tasks.map((task, i) => (
                    <DraggableTask task={task} key={task.id}>
                      <BaseTask
                        isDragging={draggingId === task.id}
                        hidden={!filterTask(task, filter)}
                        openFunc={() => openFunc(task.id)}
                        project={project}
                        task={task}
                      />
                    </DraggableTask>
                  ))
                : null}
            </div>
          </div>
        </SortableContext>
      </td>
    )
  }
)
