import React, { useState } from 'react'
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
  Fab
} from '@material-ui/core'
import { TState } from '../../types/state'
import { selectMemberA, setProjectA } from '../../store/actions/project'
import { CreateColumn } from './CreateColumn'
import { Add, FilterList, Settings, Equalizer } from '@material-ui/icons'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { NoMatch } from '../NoMatch/NoMatch'
import { FilterTasks } from './FilterTasks'
import Helmet from 'react-helmet'
import { ProjectSettings } from './ProjectSettings'

import { Mutation, MutationResult } from 'react-apollo'
import {
  EditProjectMutation,
  EditProjectMutationVariables
} from '../../graphql/types'
import { openSnackbarA } from '../../store/actions/snackbar'
import { GQL_EDIT_PROJECT } from '../../graphql/mutations/project'
import { id } from '../../utils/utilities'
import { ProjectCell } from './Cell/ProjectCell'

/**
 * @todo add a filter menu with color, column, due date, label
 */

type OwnProps = {
  params: {
    id: string
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
    input: {
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
  })

type TProps = ReturnType<typeof mapState> &
  typeof actionCreators &
  OwnProps &
  WithStyles<typeof styles>

export const getMobile = (window: Window) => {
  return window.innerWidth <= 1000
}

export type TFilterData = {
  dueDate: 'all' | 'none' | 'today' | 'tomorrow' | 'has' | [Date, Date]
  color: string | 'all' // what if we have a multiselect? string is the key of colors object
  points: number
  members: Array<string | 'all'>
  tags: Array<string | 'all'>
}

const CProject = (props: TProps) => {
  const [settings, setSettings] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(getMobile(window))
  const [filterData, setFilterData] = useState({
    dueDate: 'all',
    color: 'all',
    points: 0,
    members: ['all'],
    tags: ['all']
  } as TFilterData)
  const [filtering, setFiltering] = useState(false)
  const [name, setName] = useState(
    props.project ? props.project.name : undefined
  )

  /* const [dragTaskExec] = useMutation<
    DragTaskMutation,
    DragTaskMutationVariables
  >(GQL_DRAG_TASK, {
    onCompleted: ({ dragTask }) => {
      if (dragTask && dragTask.project) {
        props.setProject({
          id: dragTask.project.id,
          newProj: dragTask.project
        })
      }
    }
  }) */

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return
    }

    return

    // const taskId = result.draggableId
  }

  React.useEffect(() => {
    window.addEventListener('resize', () => setIsMobile(getMobile(window)))

    return () =>
      window.removeEventListener('resize', () => setIsMobile(getMobile(window)))
  }, [])

  const { classes, project } = props
  if (project) {
    return (
      <div>
        <Helmet>
          <style type="text/css">{` body { background-color: #1d364c; }`}</style>
          <meta
            name={'description'}
            content={'Projects help you become stronk'}
          />
        </Helmet>
        <AppBar color="default" className={classes.appbar} position="static">
          <Toolbar>
            <Mutation
              onCompleted={({ editProject }: EditProjectMutation) => {
                if (editProject) {
                  props.setProject({
                    id: editProject.id,
                    newProj: {
                      name: editProject.name,
                      id: editProject.id,
                      ...editProject
                    }
                  })
                  setName(editProject.name)
                }
              }}
              mutation={GQL_EDIT_PROJECT}
            >
              {(
                editProject: (obj: {
                  variables: EditProjectMutationVariables
                }) => void,
                result: MutationResult<EditProjectMutation>
              ) => {
                return (
                  <div>
                    <input
                      className={classes.input}
                      value={name}
                      onBlur={() =>
                        editProject({
                          variables: {
                            newProj: { name: name || 'newname' },
                            id: project.id
                          }
                        })
                      }
                      onChange={(e: any) => setName(e.target.value)}
                    />
                  </div>
                )
              }}
            </Mutation>
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto'
              }}
            >
              {/* Object.values(project.users).map((user, i) => {
                return (
                  <Tooltip key={user.id} title={user.username}>
                    <ButtonBase
                      onClick={() => {
                        props.selectMember({
                          id: user.id,
                          projectId: project.id
                        })
                      }}
                      style={{
                        opacity:
                          project.selectingMember === user.id ? 0.5 : undefined,
                        filter:
                          project.selectingMember === user.id
                            ? 'alpha(opacity = 50)'
                            : undefined,
                        height: 48,
                        width: 48,
                        verticalAlign: 'middle',
                        borderRadius: '50%',
                        margin: '0px 8px',
                        userSelect: 'none',
                        backgroundImage: `url(${user.profileImg})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '50% 50%',
                        backgroundSize: 'contain'
                      }}
                    />
                  </Tooltip>
                )
              }) */}
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
            <IconButton style={{ marginLeft: 8 }}>
              <Equalizer />
            </IconButton>
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
          <DragDropContext onDragEnd={onDragEnd}>
            {[0, 1, 2].map(progress => (
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  flexDirection: isMobile ? 'column' : 'row'
                }}
              >
                {project.lists.map(list => (
                  <ProjectCell
                    progress={progress}
                    list={list}
                    project={project}
                  />
                ))}
              </div>
            ))}
          </DragDropContext>

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
          title="Add Column"
        >
          <Fab
            onClick={() => setDialogOpen(true)}
            color="primary"
            className={classes.fab}
          >
            <Add />
          </Fab>
        </Tooltip>
        {settings && (
          <ProjectSettings
            project={props.project}
            onClose={() => setSettings(false)}
          />
        )}
        <FilterTasks
          project={project}
          changeFilter={(newFilter: TFilterData) => setFilterData(newFilter)}
          filterData={filterData}
          handleClose={() => setFiltering(false)}
          open={filtering}
        />
      </div>
    )
  }
  return <NoMatch />
}

const mapState = (state: TState, ownProps: OwnProps) => {
  return {
    project: state.projects[id(state.projects, ownProps.params.id)]
  }
}

const actionCreators = {
  setProject: setProjectA,
  selectMember: selectMemberA,
  openSnackbar: openSnackbarA
}

export const Project = withStyles(styles)(
  connect(
    mapState,
    actionCreators
  )(CProject)
)
