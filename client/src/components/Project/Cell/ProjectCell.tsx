import React, { useState } from 'react'
import { TList, TProject } from '../../../types/project'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { BaseTask } from '../Task/Base'
import {
  createStyles,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core'
import { id } from '../../../utils/utilities'
import { Menu, Add } from '@material-ui/icons'
import { input } from '../Project'

const styles = (theme: Theme) =>
  createStyles({
    input: input
  })

type OwnProps = {
  progress: number // 0, 1, or 2
  list: TList
  project: TProject
  collapseList: (id: string) => void
  collapsedLists: string[]
  openFunc: (id: string) => void
  deleteList: (id: string) => void
  setCreating: (id: string) => void
  editingName: string
  setEditingList: (id: [string, string]) => void
  confirmEditingList: () => void
}
type TProps = OwnProps & WithStyles<typeof styles>

export const ProjectCell = withStyles(styles)((props: TProps) => {
  let tasks = props.list.taskIds
    .map((taskId) => props.project.tasks[id(props.project.tasks, taskId)])
    .filter((task) => {
      return task.progress === props.progress
    })

  if (props.progress === 2) {
    tasks = tasks
  }

  const [anchorEl, setAnchorEl] = useState(null as any)
  const [deletingList, setDeletingList] = useState(null as any)

  return (
    <td
      style={{
        borderRight: `1px ${props.progress !== 2 ? 'dashed' : 'solid'} #aebacc`,
        borderBottom:
          props.project.lists.findIndex((list) => props.list.id === list.id) ===
          props.project.lists.length - 1
            ? '1px solid #aebacc'
            : undefined,
        borderTop: '1px solid #aebacc',
        borderLeft:
          props.progress === 0
            ? `1px ${props.progress ? 'dashed' : 'solid'} #aebacc`
            : undefined,
        width: '100%',
        padding: props.collapsedLists.includes(props.list.id) ? '0px 8px' : 8,
        maxHeight: props.collapsedLists.includes(props.list.id) ? 100 : '60vh',
        overflowY: 'auto'
      }}
    >
      {props.progress === 0 && (
        <div style={{ display: 'flex', margin: 4 }}>
          {props.collapsedLists.includes(props.list.id) && (
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
          {props.editingName ? (
            <input
              style={{ width: '100%' }}
              className={props.classes.input}
              value={props.editingName}
              onBlur={() => props.confirmEditingList()}
              onChange={(e: any) =>
                props.setEditingList([props.list.id, e.target.value])
              }
            />
          ) : (
            <h2 style={{ margin: 'auto 0px', fontSize: 18 }}>
              {props.list.name}
            </h2>
          )}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            style={{ marginLeft: 'auto' }}
          >
            <Menu />
          </IconButton>
          {!props.collapsedLists.includes(props.list.id) && (
            <IconButton
              color="primary"
              style={{ marginLeft: 8 }}
              onClick={
                () => props.setCreating('string') /* TODO: add columns */
              }
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
                props.collapseList(props.list.id)
              }}
            >
              {props.collapsedLists.includes(props.list.id)
                ? 'Uncollapse'
                : 'Collapse'}
            </MenuItem>
            <MenuItem
              onClick={() => {
                props.setEditingList([props.list.id, props.list.name])
                setAnchorEl(null)
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (deletingList && props.project.lists.length > 1) {
                  setAnchorEl(null)
                  props.deleteList(props.list.id)
                } else {
                  setDeletingList(true)
                  setTimeout(() => setDeletingList(false), 4000) // dont have confirm message forever
                }
              }}
            >
              {/* TODO:  when they click, make text red and say confirm */}
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
        isDropDisabled={props.collapsedLists.includes(props.list.id)}
        droppableId={`${props.list.id}DIVIDER${props.progress}`}
      >
        {(dropProvided, dropSnapshot) => {
          return (
            <div
              style={{
                flexDirection: 'column',
                display: 'flex',
                minHeight: props.collapsedLists.includes(props.list.id)
                  ? 0
                  : 78,
                height: `calc(100% - ${props.progress ? '78px' : '178px'})`,
                backgroundColor: 'white',
                paddingBottom: props.collapsedLists.includes(props.list.id)
                  ? 0
                  : 78 // needed for dragging to bottom of list
              }}
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
            >
              {!props.collapsedLists.includes(props.list.id)
                ? tasks.map((task, i) => (
                    <Draggable draggableId={task.id} index={i} key={task.id}>
                      {(dragProvided, dragSnapshot) => (
                        <BaseTask
                          openFunc={() => props.openFunc(task.id)}
                          project={props.project}
                          task={task}
                          provided={dragProvided}
                          snapshot={dragSnapshot}
                        />
                      )}
                    </Draggable>
                  ))
                : null}
              {dropProvided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </td>
  )
})
