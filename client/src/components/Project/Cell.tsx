import { ChangeEvent, CSSProperties, memo, useState } from 'react'
import { TList, TProject, TTask } from '../../types/project'
import { BaseTask } from '../Task/Base'
import {
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  useTheme,
  Popover,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { id } from '../../utils/utilities'
import Menu from '@mui/icons-material/Menu'
import { filterTask /*filterTasks*/ } from '../../utils/filterTasks'
import { input } from './styles'
import { useDroppable } from '@dnd-kit/core'
import DraggableTask from '../Task/Draggable'
import { PROJECT_BORDER, PROJECT_BORDER_COLOR } from './Project'
import { TState } from '../../types/state'
import { useDispatch, useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import { APIDeleteList, APISetListIdx } from '../../API/list'
import { SET_LIST, SET_LIST_IDX } from '../../store/projects'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import Add from '@mui/icons-material/Add'
interface Props {
  project: TProject
  list: TList
  progress: 0 | 1 | 2
  draggingId?: string | null
  openFunc: (id: string) => void
  viewType: 'lists' | 'kanban'
  setCreating: (id: string) => void
}

const getCellStyles = ({
  progress,
  idx,
  viewType,
  collapsed
}: {
  viewType: 'lists' | 'kanban'
  progress: number
  collapsed: boolean
  idx: number
}): CSSProperties => {
  const isLastColumn = viewType === 'lists' || progress === 2
  const isFirstColumn = viewType === 'lists' || progress === 0
  return {
    borderTop: PROJECT_BORDER,
    borderTopLeftRadius: idx > 0 || viewType === 'kanban' ? 0 : 4,
    borderTopRightRadius: idx > 0 || viewType === 'kanban' ? 0 : 4,
    borderRight: `1px ${
      isLastColumn ? 'solid' : 'dashed'
    } ${PROJECT_BORDER_COLOR}`,
    borderLeft: isFirstColumn ? PROJECT_BORDER : undefined,
    width: viewType === 'kanban' ? '100%' : undefined,
    padding: collapsed ? '0px 8px' : '8px 8px 32px 8px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}

export const ProjectCell = memo(
  ({
    project,
    list,
    progress,
    openFunc,
    draggingId,
    setCreating,
    viewType
  }: Props) => {
    const [anchorEl, setAnchorEl] = useState(null as HTMLElement | null)
    const [rightClickAnchorEl, setRightClickAnchorEl] = useState<null | {
      el: EventTarget
      top: number
      left: number
    }>(null)
    const [deletingList, setDeletingList] = useState(false)
    const [editingList, setEditingList] = useState(['', ''])
    //const [collapsed, setCollapsed] = useState(false)
    const collapsed = false // TODO: a bunch of problems

    const { filter } = useSelector((state: TState) => ({
      filter: state.filter
    }))

    const dispatch = useDispatch()

    const editList = () => {
      dispatch(
        SET_LIST({
          id: editingList[0],
          projectId: project.id,
          newList: { name: editingList[1] }
        })
      )
      setEditingList(['', ''])
    }

    let tasks =
      viewType === 'lists'
        ? list.taskIds.reduce((accum, cur) => {
            return [
              ...accum,
              ...cur.map((taskId) => project.tasks[id(project.tasks, taskId)])
            ]
          }, [] as TTask[])
        : list.taskIds[progress].map(
            (taskId) => project.tasks[id(project.tasks, taskId)]
          )

    // TODO: For now tasks cannot be dragged if tasks are filtered out
    //const isDragDisabled = tasks.length !== filterTasks(tasks, filter).length

    const editingName =
      progress === 0 && list.id === editingList[0] ? editingList[1] : ''

    const { setNodeRef } = useDroppable({ id: `${list.id}|${progress}` })

    const deleteList = () => {
      dispatch(
        SET_LIST({
          id: list.id,
          projectId: project.id,
          newList: undefined
        })
      )

      APIDeleteList({ id: list.id, projId: project.id })
    }

    const setListIdx = (id: string, offset: number) => {
      dispatch(SET_LIST_IDX({ id, offset, projectId: project.id }))
      setAnchorEl(null)
      APISetListIdx({ id, offset, projId: project.id })
    }

    const theme = useTheme()

    const menuItems = (
      <div>
        <MenuItem
          disabled={id(project.lists, list.id) === 0}
          onClick={() => {
            setRightClickAnchorEl(null)
            setAnchorEl(null)
            setListIdx(list.id, -1)
          }}
        >
          <ListItemIcon>
            <ArrowUpward fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRightClickAnchorEl(null)
            setAnchorEl(null)
            setCreating(list.id)
          }}
        >
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Task</ListItemText>
        </MenuItem>
        {/*<MenuItem
          onClick={() => {
            setAnchorEl(null)
            setRightClickAnchorEl(null)
            setCollapsed((prev) => !prev)
          }}
        >
          {collapsed ? 'Uncollapse' : 'Collapse'}
        </MenuItem>*/}
        <MenuItem
          onClick={() => {
            setEditingList([list.id, list.name])
            setAnchorEl(null)
            setRightClickAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit List</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={project.lists.length === 1}
          onClick={() => {
            if (deletingList && project.lists.length > 1) {
              setAnchorEl(null)
              setRightClickAnchorEl(null)

              deleteList()
            } else {
              const DOUBLE_CLICK_TIMEOUT = 4000
              setDeletingList(true)
              setTimeout(() => setDeletingList(false), DOUBLE_CLICK_TIMEOUT)
            }
          }}
        >
          <ListItemIcon>
            <Delete
              style={{ color: deletingList ? 'red' : undefined }}
              fontSize="small"
            />
          </ListItemIcon>
          <ListItemText>
            {deletingList ? (
              <div style={{ color: 'red', fontWeight: 500 }}>Confirm</div>
            ) : (
              'Delete List'
            )}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setListIdx(list.id, 1)
            setRightClickAnchorEl(null)
            setAnchorEl(null)
          }}
          disabled={id(project.lists, list.id) === project.lists.length - 1}
        >
          <ListItemIcon>
            <ArrowDownward fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </div>
    )

    // TODO: make background color change when dragging task, same for task changing when dragging user on
    return (
      <>
        <Popover
          anchorEl={rightClickAnchorEl ? (rightClickAnchorEl as any).el : null}
          open={Boolean(rightClickAnchorEl)}
          anchorReference="anchorPosition"
          anchorPosition={
            rightClickAnchorEl
              ? {
                  top: (rightClickAnchorEl as any).top,
                  left: (rightClickAnchorEl as any).left
                }
              : undefined
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          onClose={() => setRightClickAnchorEl(null)}
        >
          {menuItems}
        </Popover>
        <td
          onContextMenu={(e) => {
            e.preventDefault()

            setRightClickAnchorEl({
              el: e.currentTarget,
              top: e.clientY,
              left: e.clientX
            } as any)
          }}
          style={getCellStyles({
            collapsed,
            progress,
            viewType,
            idx: id(project.lists, list.id)
          })}
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
                    userSelect: 'none',
                    color: theme.palette.text.secondary
                  }}
                >
                  {list.name}
                </h2>
              )}
              <IconButton
                aria-label="list menu"
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
                  aria-label="create task"
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
                {menuItems}
              </MuiMenu>
            </div>
          )}
          <SortableContext
            id={`${list.id}|${progress}`}
            items={tasks.map((task) => task.id)}
            strategy={(() => {}) as any}
          >
            <div ref={setNodeRef} style={{ height: '100%', maxWidth: '100%' }}>
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
                      <DraggableTask id={task.id} key={task.id}>
                        <BaseTask
                          showProgress={viewType === 'lists'}
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
      </>
    )
  }
)
