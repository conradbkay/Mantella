import React, { useState, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { CreateTask } from './CreateTask'
import { Droppable } from 'react-beautiful-dnd'
import { TTask } from '../../types/task'
import { TColumn, TSwimLane } from '../../types/state'
import { DeleteDialog } from '../utils/DeleteDialog'
import { setColumnA } from '../../store/actions/column'
import { ColumnTask } from '../Task/ColumnWrapper'
import { TFilterData } from '../Project/Project'
import { filterTasks } from '../../utils/filterTasks'
import { ColumnHeader } from './ColumnHeader'
import { TProject } from '../../types/project'
import { getAllTasks, getUnassignedTasks } from '../../utils/utilities'
import { useMutation } from '@apollo/react-hooks'
import {
  DeleteColumnMutation,
  DeleteColumnMutationVariables
} from '../../graphql/types'
import { GQL_DELETE_COLUMN } from '../../graphql/mutations/column'
import { setProjectA } from '../../store/actions/project'
import { resToNiceProject } from '../../API/utils'

const getSwimlineTasks = (filteredTasks: TTask[], swimlane: TSwimLane) => {
  const swimlaneTasks: TTask[] = []
  swimlane.taskIds.map(taskId => {
    const foundTask = filteredTasks.find(task => {
      return task.id === taskId
    })
    if (foundTask) {
      swimlaneTasks.push(foundTask)
    }
  })

  return swimlaneTasks
}

const TaskMap = ({
  taskArr,
  taskProps,
  project
}: {
  taskArr: TTask[]
  taskProps: { isCompletedColumn?: boolean }
  project: TProject
}) => (
  <div>
    {taskArr.map((task, i) => {
      return task ? (
        <div key={task.id}>
          <ColumnTask project={project} task={task} index={i} {...taskProps} />
        </div>
      ) : null
    })}
  </div>
)

const root = (isMobile: boolean, index: number | 'end'): CSSProperties => ({
  width: '100%',
  marginTop: isMobile ? 20 : 0,
  margin: '0px 12px'
})

const collapsedStyles: CSSProperties = {
  cursor: 'pointer',
  writingMode: 'vertical-rl',
  fontSize: 27,
  backgroundColor: '#f2f2f2',
  color: '#555',
  minHeight: 100
}

const swimlaneHeader: CSSProperties = {
  color: '#515151',
  fontWeight: 500,
  fontSize: 18,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white'
}

const columnWrapper = (draggingOver: boolean): CSSProperties => ({
  flexDirection: 'column',
  display: 'flex',
  minHeight: 78,
  backgroundColor: draggingOver ? '#bae3ff' : 'white',
  transition: 'background-color .2s ease'
})

const ColumnWrapper = (props: {
  children: React.ReactNode
  headerName: string
}) => {
  return (
    <div>
      <div style={{ ...swimlaneHeader, minHeight: 48 }}>{props.headerName}</div>
      {props.children}
    </div>
  )
}

interface OwnProps {
  filterData: TFilterData
  column: TColumn
  isMobile: boolean
  projectId: string
  collapse: () => void
  collapsed: boolean
  index: number | 'end'
}
type ColumnProps = ReturnType<typeof mapState> &
  typeof actionCreators &
  OwnProps

const CColumn = (props: ColumnProps) => {
  const [deleting, setDeleting] = useState(false)
  const [creatingTask, setCreatingTask] = useState(false)
  const [deleteColumn] = useMutation<
    DeleteColumnMutation,
    DeleteColumnMutationVariables
  >(GQL_DELETE_COLUMN, {
    onCompleted: ({ deleteColumn: deleteCol }) => {
      if (deleteCol && deleteCol.project) {
        props.setProject({
          id: deleteCol.project.id,
          newProj: resToNiceProject(deleteCol.project)
        })
      }
    },
    variables: {
      id: props.column.id,
      projectId: props.projectId
    }
  })

  const {
    tasks,
    column,
    index,
    isMobile,
    filterData,
    collapsed,
    collapse,
    project
  } = props

  const projSwimlanes = project.swimlaneOrder.map(id => project.swimlanes[id])

  const creatingDisabled = column.taskIds.length === column.taskLimit

  const sortedTasks = column.taskIds.map(id => tasks[id])
  const filteredTasks: TTask[] = filterTasks(sortedTasks, filterData)

  const unassignedTasks = getUnassignedTasks(filteredTasks, tasks, project)

  const rootStyle = root(isMobile, index)

  return (
    <div style={rootStyle}>
      {collapsed ? (
        <div onClick={() => collapse()} style={collapsedStyles}>
          <span style={{ marginTop: 20 }}>{column.name}</span>
        </div>
      ) : (
        <>
          <ColumnHeader
            index={index}
            disableAdd={creatingDisabled}
            project={project}
            setDeleting={setDeleting}
            setCreatingTask={setCreatingTask}
            column={column}
            collapse={collapse}
          />
          <ColumnWrapper headerName={'Unassigned'}>
            <Droppable
              droppableId={column.id.toString()}
              isDropDisabled={
                column.taskLimit
                  ? column.taskIds.length >= column.taskLimit
                  : false
              }
            >
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  style={{
                    ...columnWrapper(snapshot.isDraggingOver)
                  }}
                  ref={provided.innerRef}
                >
                  <div>
                    <TaskMap
                      project={project}
                      taskProps={{
                        isCompletedColumn: column.isCompletedColumn
                      }}
                      taskArr={unassignedTasks}
                    />
                  </div>
                  {
                    provided.placeholder /* makes it expand when we hover over draggable */
                  }
                </div>
              )}
            </Droppable>
          </ColumnWrapper>
          {projSwimlanes.map((swimlane, i) => {
            const swimlaneTasks: TTask[] = getSwimlineTasks(
              filteredTasks,
              swimlane
            )

            return (
              <ColumnWrapper key={swimlane.id} headerName={swimlane.name}>
                <Droppable
                  isDropDisabled={
                    column.taskLimit
                      ? column.taskIds.length >= column.taskLimit
                      : false
                  }
                  droppableId={`${column.id} DIVIDER ${swimlane.id}`}
                >
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.droppableProps}
                      style={columnWrapper(snap.isDraggingOver)}
                    >
                      <TaskMap
                        project={project}
                        taskProps={{
                          isCompletedColumn: column.isCompletedColumn
                        }}
                        taskArr={swimlaneTasks}
                      />

                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              </ColumnWrapper>
            )
          })}
        </>
      )}
      {/* models */}
      {deleting && (
        <DeleteDialog
          name="Column"
          deleteFunc={(id: string) => {
            deleteColumn()
          }}
          id={column.id}
          onClose={() => setDeleting(false)}
        />
      )}
      {creatingTask && (
        <CreateTask
          projectId={props.projectId}
          onClose={() => setCreatingTask(false)}
          columnId={column.id}
        />
      )}
    </div>
  )
}

const mapState = (state: TState, ownProps: OwnProps) => {
  return {
    tasks: getAllTasks(state.projects),
    project: state.projects[ownProps.projectId]
  }
}

const actionCreators = {
  setColumn: setColumnA,
  setProject: setProjectA
}

export const Column = connect(
  mapState,
  actionCreators
)(CColumn)
