import { ChangeEvent, CSSProperties, useState } from 'react'
import { TList, TProject, TTask } from '../../../types/project'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { BaseTask } from '../Task/Base'
import { IconButton, Menu as MuiMenu, MenuItem } from '@mui/material'
import { id } from '../../../utils/utilities'
import Menu from '@mui/icons-material/Menu'
import Add from '@mui/icons-material/Add'
import { filterTask, filterTasks } from '../../../utils/filterTasks'
import { TFilterData } from '../types'
import { input } from '../styles'

interface Props {
  project: TProject
  list: TList
  progress: 0 | 1 | 2
  filter: TFilterData
  collapsedLists: string[]
  editingName: string
  collapseList: (id: string) => void
  openFunc: (id: string) => void
  deleteList: (id: string) => void
  setCreating: (id: string) => void
  setEditingList: (id: [string, string]) => void
  confirmEditingList: () => void
  isDraggingUser: boolean
}

const getCellTasks = (
  tasks: TTask[],
  taskIds: string[],
  progress: 0 | 1 | 2
): TTask[] => {
  const listTasks = taskIds.map((taskId) => tasks[id(tasks, taskId)])

  const cellTasks = listTasks.filter((task) => {
    return task.progress === progress
  })
  return cellTasks
}

const getCellStyles = ({
  project,
  list,
  progress,
  isCollapsed
}: {
  project: TProject
  list: TList
  progress: number
  isCollapsed: boolean
}): CSSProperties => {
  const isLastColumn = progress === 2
  const isFirstColumn = progress === 0
  const isFinalRow =
    project.lists.findIndex((projList) => projList.id === list.id) ===
    project.lists.length - 1
  const borderColor = '#aebacc' // light grey
  return {
    borderTop: '1px solid ' + borderColor,
    borderRight: `1px ${isLastColumn ? 'solid' : 'dashed'} ${borderColor}`,
    borderBottom: isFinalRow ? '1px solid ' + borderColor : undefined,
    borderLeft: isFirstColumn ? '1px solid ' + borderColor : undefined,
    width: '100%',
    padding: isCollapsed ? '0px 8px' : 8,
    maxHeight: isCollapsed ? 100 : '60vh',
    overflowY: 'auto'
  }
}

export const ProjectCell = ({
  project,
  list,
  progress,
  filter,
  collapsedLists,
  editingName,
  collapseList,
  openFunc,
  deleteList,
  setCreating,
  setEditingList,
  confirmEditingList,
  isDraggingUser
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null as HTMLElement | null)
  const [deletingList, setDeletingList] = useState(false)

  let tasks = getCellTasks(project.tasks, list.taskIds, progress)
  // TODO: For now tasks cannot be dragged if tasks are filtered out
  const isDragDisabled = tasks.length !== filterTasks(tasks, filter).length
  const isCollapsed = collapsedLists.includes(list.id)

  return (
    <td style={getCellStyles({ project, isCollapsed, list, progress })}>
      {progress === 0 && (
        <div style={{ display: 'flex', margin: 4 }}>
          {isCollapsed && (
            <h2
              style={{
                fontSize: 16,
                margin: 'auto 8px auto 0px',
                color: 'gray'
              }}
            >
              [Collapsed]
            </h2>
          )}
          {editingName ? (
            <input
              style={{ width: '100%', ...input }}
              value={editingName}
              onBlur={() => confirmEditingList()}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditingList([list.id, e.target.value])
              }
            />
          ) : (
            <h2 style={{ margin: 'auto 0px', fontSize: 18 }}>{list.name}</h2>
          )}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            style={{ marginLeft: 'auto' }}
          >
            <Menu />
          </IconButton>
          {!isCollapsed && (
            <IconButton
              color="primary"
              style={{ marginLeft: 8 }}
              onClick={() => setCreating('string')}
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
                collapseList(list.id)
              }}
            >
              {isCollapsed ? 'Uncollapse' : 'Collapse'}
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
              onClick={() => {
                if (deletingList && project.lists.length > 1) {
                  setAnchorEl(null)
                  deleteList(list.id)
                } else {
                  const DOUBLE_CLICK_TIMEOUT = 4000
                  setDeletingList(true)
                  setTimeout(() => setDeletingList(false), DOUBLE_CLICK_TIMEOUT)
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
      <Droppable
        isCombineEnabled={isDraggingUser}
        isDropDisabled={isCollapsed}
        droppableId={`${list.id}|${progress}` /* can only be a string*/}
      >
        {(dropProvided, dropSnapshot) => {
          return (
            <div
              style={{
                flexDirection: 'column',
                display: 'flex',
                minHeight: isCollapsed ? 0 : 78,
                backgroundColor: 'white',
                paddingBottom: isCollapsed ? 0 : 78 // needed for dragging to bottom of list
              }}
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
            >
              {!isCollapsed
                ? tasks.map((task, i) => (
                    <Draggable
                      isDragDisabled={isDragDisabled}
                      draggableId={task.id}
                      index={i}
                      key={task.id}
                    >
                      {(dragProvided, dragSnapshot) => (
                        <BaseTask
                          style={
                            isDraggingUser
                              ? {
                                  transform: 'none !important'
                                }
                              : {}
                          }
                          hidden={!filterTask(task, filter)}
                          openFunc={() => openFunc(task.id)}
                          project={project}
                          task={task}
                          provided={dragProvided}
                          snapshot={dragSnapshot}
                        />
                      )}
                    </Draggable>
                  ))
                : null}
              {isDraggingUser ? (
                <div style={{ visibility: 'hidden', height: 0 }}>
                  {dropProvided.placeholder}
                </div>
              ) : (
                dropProvided.placeholder
              )}
            </div>
          )
        }}
      </Droppable>
    </td>
  )
}
