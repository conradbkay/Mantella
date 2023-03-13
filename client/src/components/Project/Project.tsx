import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Theme,
  Tooltip,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  TableBody,
  SpeedDial,
  SpeedDialAction
} from '@mui/material'
import { TState } from '../../types/state'
import { selectMemberA, setProjectA } from '../../store/actions/project'
import { CreateColumn } from './CreateColumn'
import Add from '@mui/icons-material/Add'
import FilterList from '@mui/icons-material/FilterList'
import Settings from '@mui/icons-material/Settings'
import Equalizer from '@mui/icons-material/Equalizer'
import Create from '@mui/icons-material/Create'
import Send from '@mui/icons-material/Send'
import { NoMatch } from '../NoMatch/NoMatch'
import Helmet from 'react-helmet'
import { ProjectSettings } from './ProjectSettings'
import { openSnackbarA } from '../../store/actions/snackbar'
import { id } from '../../utils/utilities'
import { ProjectCell } from './Cell/ProjectCell'
import { CreateTask } from './Task/Create'
import { EditTaskModal } from './Task/Edit/Edit'
import { setListA } from '../../store/actions/list'
import { FilterTasks } from './FilterTasks'
import { setFilterA } from '../../store/actions/filter'
import { ProjStats } from './Statistics'
import { APIAssignUserToTask, APIDragTask } from '../../API/task'
import { onDragEnd } from '../../utils/dragTask'
import { ShareProject } from './ShareProject'
import { setTaskA } from '../../store/actions/task'
import makeStyles from '@mui/styles/makeStyles'
import { input } from './styles'
import DraggableAvatar from './Task/DraggableAvatar'
import { useDroppable } from '@dnd-kit/core'

/**
 * @todo add a filter menu with color, column, due date, label
 */

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  tooltip: {
    fontSize: 18
  }
}))

type ActionCreators = typeof actionCreators

type OwnProps = {
  params: {
    id: string
  }
}

interface TProps
  extends ReturnType<typeof mapState>,
    ActionCreators,
    OwnProps {}

const getMobile = (window: Window) => {
  return window.innerWidth <= 1000
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

  const dragUser = async (result: any) => {
    if (result.combine) {
      const newTask = await APIAssignUserToTask({
        taskId: result.combine!.draggableId,
        projId: project.id,
        userId: result.draggableId.slice(4)
      })

      props.setTask({
        id: newTask.id,
        newTask,
        projectId: project.id
      })
    }
    if (isDraggingUser) {
      setIsDraggingUser(false)
    }
  }

  const dragFromTask = async (result: any) => {
    // assume they want to remove the user from the task if they don't drag it to another task
    if (!result.destination || result.destination.droppableId === 'users') {
      const [, taskId, userId] = result.draggableId.split('|')

      const newTask = await APIAssignUserToTask({
        taskId: taskId,
        projId: project.id,
        userId: userId
      })

      props.setTask({
        id: newTask.id,
        newTask,
        projectId: project.id
      })
    } else {
    }
  }

  const dragTask = (result: any) => {
    if (result.draggableId.slice(0, 4) === 'USER') {
      dragUser(result)
    } else if (result.draggableId.slice(0, 9) === 'TASK_USER') {
      dragFromTask(result)
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

  console.log(dragTask)

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

  const { project } = props

  const classes = useStyles()

  const { setNodeRef } = useDroppable({ id: 'users' })

  if (project) {
    return (
      <div>
        <Helmet>
          <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        </Helmet>
        <AppBar color="default" position="static">
          <Toolbar>
            <input
              style={{ ...input, width: `${windowWidth - 300}px` }}
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
              onClick={(e: any) => {
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

export const Project = connect(mapState, actionCreators)(CProject)
