import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  WithStyles,
  withStyles,
  Theme,
  createStyles,
  Tooltip,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  TableBody
} from '@material-ui/core'
import { TState } from '../../types/state'
import { selectMemberA, setProjectA } from '../../store/actions/project'
import { CreateColumn } from './CreateColumn'
import {
  Add,
  FilterList,
  Settings,
  Equalizer,
  Create,
  Send
} from '@material-ui/icons'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import { NoMatch } from '../NoMatch/NoMatch'
import Helmet from 'react-helmet'
import { ProjectSettings } from './ProjectSettings'
import { openSnackbarA } from '../../store/actions/snackbar'
import { id } from '../../utils/utilities'
import { ProjectCell } from './Cell/ProjectCell'
import { CreateTask } from './Task/Create'
import { EditTaskModal } from './Task/Edit/Edit'
import { setListA } from '../../store/actions/list'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { FilterTasks } from './FilterTasks'
import { setFilterA } from '../../store/actions/filter'
import { ProjStats } from './Statistics'
import { CSSProperties } from '@material-ui/styles'
import { APIDragTask } from '../../API/task'
import { onDragEnd } from '../../utils/dragTask'
import { ShareProject } from './ShareProject'
import { HoverableAvatar } from '../utils/HoverableAvatar'
import axios from 'axios'
import { setTaskA } from '../../store/actions/task'

/**
 * @todo add a filter menu with color, column, due date, label
 */

export const input: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  minWidth: '20%',
  fontSize: 18,
  outline: 'none',
  backgroundColor: '#f5f5f5',
  borderRadius: 4,
  width: 'auto',
  padding: 8,
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: 'white'
  },
  '&:focus': {
    borderColor: '#27b6ba'
  }
}

const styles = (theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    tooltip: {
      fontSize: 18
    },
    appbar: {},
    input: input
  })

type ActionCreators = typeof actionCreators

type OwnProps = {
  params: {
    id: string
  }
}

interface TProps
  extends ReturnType<typeof mapState>,
    ActionCreators,
    OwnProps,
    WithStyles<typeof styles> {}

export const getMobile = (window: Window) => {
  return window.innerWidth <= 1000
}

export type TFilterData = {
  dueDate: 'all' | 'none' | 'today' | 'tomorrow' | [Date | null, Date | null]
  color: string[]
  points?: [number, number]
}

const CProject = (props: TProps) => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const [settings, setSettings] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(getMobile(window))
  const [collapsedLists, setCollapsedLists] = useState([] as string[])
  const [editingList, setEditingList] = useState(['', ''])
  const [stats, setStats] = useState(false)

  const [isDraggingUser, setIsDraggingUser] = useState(false)

  if (isMobile) {
  }

  const [name, setName] = useState(
    props.project ? props.project.name : undefined
  )

  const [filtering, setFiltering] = useState(false)
  const [creating, setCreating] = useState('')
  const [fab, setFab] = useState(false)

  const dragUser = async (result: DropResult) => {
    if (result.combine) {
      const { data } = await axios.post('/assignUserToTask', {
        taskId: result.combine!.draggableId,
        projId: project.id,
        userId: result.draggableId.slice(4)
      })

      props.setTask({
        id: data.task.id,
        newTask: data.task,
        projectId: project.id
      })
    }
    if (isDraggingUser) {
      setIsDraggingUser(false)
    }
  }

  const dragTask = (result: DropResult) => {
    if (result.draggableId.slice(0, 4) === 'USER') {
      dragUser(result)
    } else {
      const val = onDragEnd(result, project)
      if (val) {
        const { editProject, fromListId, toListId, newColumn, realIndex } = val
        APIDragTask({
          projectId: props.project.id,
          oldListId: fromListId,
          newListId: toListId,
          id: result.draggableId,
          newProgress: newColumn,
          newIndex: realIndex
        })
        props.setProject({ id: props.project.id, newProj: editProject })
      }
    }
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobile(getMobile(window))
      setWindowWidth(window.innerWidth)
    })

    return () =>
      window.removeEventListener('resize', () => {
        setIsMobile(getMobile(window))
        setWindowWidth(window.innerWidth)
      })
  }, [])

  const editList = () => {
    props.setList({
      id: editingList[0],
      projectId: props.project.id,
      newList: { name: editingList[1] }
    })
    setEditingList(['', ''])
  }

  const { classes, project } = props
  if (project) {
    return (
      <div>
        <Helmet>
          <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        </Helmet>
        <DragDropContext
          onDragEnd={dragTask}
          onDragStart={(initial) => {
            if (initial.draggableId.slice(0, 4) === 'USER') {
              setIsDraggingUser(true)
            }
          }}
        >
          <AppBar color="default" className={classes.appbar} position="static">
            <Toolbar>
              <input
                style={{ width: `${windowWidth - 300}px` }}
                className={classes.input}
                value={name}
                onBlur={() =>
                  props.setProject({
                    id: project.id,
                    newProj: { ...project, name: name || 'newname' }
                  })
                }
                onChange={(e: any) => setName(e.target.value)}
              />
              <div style={{ marginLeft: 'auto', display: 'flex' }}>
                <Droppable droppableId="users">
                  {(dropProvided, dropSnapshot) => (
                    <div
                      {...dropProvided.droppableProps}
                      ref={dropProvided.innerRef}
                      style={{
                        display: 'flex'
                      }}
                    >
                      {project.users.map((user, i) => (
                        <Draggable
                          key={user.id}
                          index={i}
                          draggableId={'USER' + user.id.toString()}
                        >
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              key={user.id}
                              style={{
                                ...prov.draggableProps.style,
                                display: 'flex'
                              }}
                            >
                              <HoverableAvatar user={user} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <div style={{ visibility: 'hidden', height: 0 }}>
                        {dropProvided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
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
          <Paper
            style={{
              margin: 20,
              padding: 20,
              paddingBottom: 80,
              minHeight: 'calc(100vh - 328px)'
            }}
          >
            <table
              style={{
                tableLayout: 'fixed',
                width: '100%',
                borderCollapse: 'separate'
              }}
            >
              <TableBody>
                <tr style={{ display: 'flex' }}>
                  {[0, 1, 2].map((col) => (
                    <td
                      key={col}
                      style={{
                        width: '100%',
                        backgroundColor: '#f2f2f2',
                        borderLeft: col ? 'none' : '1px solid #aebacc',
                        borderRight: '1px solid #aebacc',
                        borderTop: '1px solid #aebacc',
                        textAlign: 'center',
                        padding: 8,
                        fontSize: 20
                      }}
                    >
                      {col === 0
                        ? 'No Progress'
                        : col === 1
                        ? 'In Progress'
                        : 'Complete'}
                    </td>
                  ))}
                </tr>
                {project.lists.map((list) => (
                  <tr
                    style={{
                      verticalAlign: 'top',
                      display: 'flex'
                    }}
                    key={list.id}
                  >
                    {[0, 1, 2].map((progress, i) => (
                      <ProjectCell
                        isDraggingUser={isDraggingUser}
                        filter={props.filterData}
                        confirmEditingList={() => editList()}
                        setEditingList={(id) => setEditingList(id)}
                        editingName={
                          progress === 0
                            ? list.id === editingList[0]
                              ? editingList[1]
                              : ''
                            : ''
                        }
                        setCreating={(id) => setCreating(id)}
                        deleteList={(listId) => {
                          props.setList({
                            id: listId,
                            projectId: props.project.id,
                            newList: null
                          })
                        }}
                        collapseList={(listId) => {
                          if (collapsedLists.includes(listId)) {
                            setCollapsedLists(
                              collapsedLists.filter((lId) => listId !== lId)
                            )
                          } else {
                            setCollapsedLists([...collapsedLists, listId])
                          }
                        }}
                        collapsedLists={collapsedLists}
                        openFunc={(tId: string) => setEditingTaskId(tId)}
                        key={i}
                        progress={progress as 0 | 1 | 2}
                        list={list}
                        project={project}
                      />
                    ))}
                  </tr>
                ))}
              </TableBody>
            </table>
            {creating && (
              <CreateTask
                onClose={() => setCreating('')}
                project={props.project}
                listId={props.project.lists[0].id}
                columnId={creating}
              />
            )}
            {dialogOpen && (
              <CreateColumn
                onClose={() => setDialogOpen(false)}
                project={project}
              />
            )}
          </Paper>
        </DragDropContext>

        <Tooltip
          placement="left"
          classes={{ tooltip: classes.tooltip }}
          title="Add List"
        >
          <SpeedDial
            open={fab}
            ariaLabel="create list/create task"
            onClick={() => setDialogOpen(true)}
            onClose={() => setFab(false)}
            onOpen={() => setFab(true)}
            color="primary"
            className={classes.fab}
            direction="up"
            icon={<Add />}
          >
            <SpeedDialAction
              icon={<Create />}
              tooltipTitle="Create Task"
              onClick={(e) => {
                e.stopPropagation()
                setCreating(project.lists[0].id)
              }}
            />
          </SpeedDial>
        </Tooltip>
        <ProjectSettings
          open={settings}
          project={props.project}
          onClose={() => setSettings(false)}
        />
        <ShareProject
          open={sharing}
          projectId={props.project.id}
          onClose={() => setSharing(false)}
        />
        {Boolean(editingTaskId) && (
          <EditTaskModal
            taskId={editingTaskId}
            onClose={() => setEditingTaskId('')}
            projectId={props.project.id}
          />
        )}
        <FilterTasks
          open={filtering}
          filterData={props.filterData}
          changeFilter={(newFilter) => props.setFilter(newFilter)}
          handleClose={() => setFiltering(false)}
        />
        <ProjStats
          projectId={project.id}
          open={stats}
          handleClose={() => setStats(false)}
        />
      </div>
    )
  }
  return <NoMatch />
}

const mapState = (state: TState, ownProps: OwnProps) => {
  return {
    project: state.projects[id(state.projects, ownProps.params.id)],
    filterData: state.filter
  }
}

const actionCreators = {
  setProject: setProjectA,
  selectMember: selectMemberA,
  openSnackbar: openSnackbarA,
  setList: setListA,
  setFilter: setFilterA,
  setTask: setTaskA
}

export const Project = withStyles(styles)(
  connect(mapState, actionCreators)(CProject)
)
