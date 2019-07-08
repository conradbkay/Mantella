import React, { useState, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { CreateTask } from './CreateTask'
import { Droppable } from 'react-beautiful-dnd'
import { TColumn, TSwimlane, TTask } from '../../types/project'
import { DeleteDialog } from '../utils/DeleteDialog'
import { setColumnA } from '../../store/actions/column'
import { ColumnTask } from '../Task/ColumnWrapper'
import { TFilterData } from '../Project/Project'
import { ColumnHeader } from './ColumnHeader'
import { TProject } from '../../types/project'
import { useMutation } from '@apollo/react-hooks'
import {
  DeleteColumnMutation,
  DeleteColumnMutationVariables
} from '../../graphql/types'
import { setProjectA } from '../../store/actions/project'
import { GQL_DELETE_COLUMN } from '../../graphql/mutations/column'
import { getUnassignedTasks, getAllTasks, id } from '../../utils/utilities'

const getSwimlineTasks = (filteredTasks: TTask[], swimlane: TSwimlane) => {
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
  project
}: {
  taskArr: TTask[]
  project: TProject
}) => (
  <div>
    {taskArr.map((task, i) => {
      return task ? (
        <div key={task.id}>
          <ColumnTask project={project} task={task} index={i} />
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
          newProj: deleteCol.project
        })
      }
    },
    variables: {
      id: props.column.id,
      projectId: props.projectId
    }
  })

  const { tasks, column, index, isMobile, collapsed, collapse, project } = props

  const projSwimlanes = project.swimlanes

  const creatingDisabled = column.taskIds.length === column.taskLimit

  const sortedTasks = column.taskIds.map(colId => tasks[id(tasks, colId)])
  const filteredTasks: TTask[] = sortedTasks

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
                    <TaskMap project={project} taskArr={unassignedTasks} />
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
                      <TaskMap project={project} taskArr={swimlaneTasks} />

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
          deleteFunc={(colId: string) => {
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
    project: state.projects[id(state.projects, ownProps.projectId)]
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
