import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Paper, TableBody, SpeedDial, SpeedDialAction } from '@mui/material'
import { TState } from '../../types/state'
import { CreateColumn } from './CreateColumn'
import Add from '@mui/icons-material/Add'
import Create from '@mui/icons-material/Create'
import { NoMatch } from '../NoMatch/NoMatch'
import Helmet from 'react-helmet'
import { id } from '../../utils/utilities'
import { ProjectCell } from './Cell/ProjectCell'
import { CreateTask } from './Task/Create'
import { EditTaskModal } from './Task/Edit/Edit'
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation
} from '@dnd-kit/core'
import ProjectHeader from './ProjectHeader'
import { BaseTask } from './Task/Base'
import { APIDragTask } from '../../API/task'
import { cloneDeep } from 'lodash'
import { setProjectA } from '../../store/actions/project'

/**
 * @todo add a filter menu with color, column, due date, label
 */

type Props = {
  params: {
    id: string
  }
}

export const taskDummyOpacity = '0.4'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: taskDummyOpacity
      }
    }
  })
}
export const PROJECT_BORDER_COLOR = '#aebacc' // light grey
export const PROJECT_BORDER = '1px solid ' + PROJECT_BORDER_COLOR

const PROGRESS_DISPLAYS = ['No Progress', 'In Progress', 'Complete']

// when dragging to an empty list droppable.sortable will be empty
const getDragEventData = ({ active, over }: DragOverEvent | DragEndEvent) => {
  if (over && active.id !== over.id && active.data.current) {
    const taskId = active.id as string
    const fromIdx = active.data.current.sortable.index
    const [fromListId] = active.data.current.sortable.containerId.split('|')
    const [toListId, toProgress] = (over.id as string).includes('|')
      ? (over.id as string).split('|')
      : over.data.current!.sortable.containerId.split('|')

    const toIdx = over.data.current ? over.data.current.sortable.index : 0

    return {
      taskId,
      toIdx,
      fromIdx,
      fromListId,
      toListId,
      toProgress: parseInt(toProgress)
    }
  }
  return null
}

export const Project = (props: Props) => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draggingId, setDraggingId] = useState(null as string | null)

  const [creating, setCreating] = useState('')
  const [fab, setFab] = useState(false)

  const { project } = useSelector((state: TState) => {
    return {
      project: state.projects[id(state.projects, props.params.id)]
    }
  })

  const dispatch = useDispatch()

  const onDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as string)
  }

  const onDragOver = (event: DragOverEvent) => {
    const data = getDragEventData(event)

    if (data) {
      const { fromListId, toListId, toProgress, toIdx, fromIdx, taskId } = data

      const editLists = cloneDeep(project.lists)
      const editTasks = cloneDeep(project.tasks)

      const [fromList, toList] = [
        editLists[id(editLists, fromListId)],
        editLists[id(editLists, toListId)]
      ]

      fromList.taskIds = fromList.taskIds.filter((id: any) => id !== taskId)
      toList.taskIds.splice(fromIdx > toIdx ? toIdx + 1 : toIdx, 0, taskId)

      editTasks[id(editTasks, taskId)].progress = toProgress

      dispatch(
        setProjectA({
          id: project.id,
          newProj: { ...project, lists: editLists, tasks: editTasks }
        })
      )
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const data = getDragEventData(event)

    if (data) {
      const { fromListId, toListId, toProgress, toIdx, taskId } = data

      APIDragTask({
        projectId: project.id,
        oldListId: fromListId,
        newListId: toListId,
        id: taskId,
        newProgress: toProgress,
        newIndex: toIdx
      })
    }
    setDraggingId(null)
  }

  const onDragCancel = () => {
    setDraggingId(null)
  }

  if (project) {
    return (
      <>
        <Helmet>
          <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        </Helmet>
        <DndContext
          autoScroll={false}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <ProjectHeader project={project} />

          <Paper
            style={{
              margin: 20,
              padding: '20px 20px 40px',
              minHeight: 'calc(100vh - 328px)'
            }}
          >
            <table
              style={{
                width: '100%',
                tableLayout: 'fixed' // faster render,
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
                        borderLeft: col ? 'none' : PROJECT_BORDER,
                        borderRight: PROJECT_BORDER,
                        borderTop: PROJECT_BORDER,
                        textAlign: 'center',
                        padding: 8,
                        fontSize: 20
                      }}
                    >
                      {PROGRESS_DISPLAYS[col]}
                    </td>
                  ))}
                </tr>
                {project.lists.map((list) => (
                  <tr
                    style={{
                      display: 'flex'
                    }}
                    key={list.id}
                  >
                    {[0, 1, 2].map((progress) => (
                      <ProjectCell
                        draggingId={draggingId}
                        setCreating={(id) => setCreating(id)}
                        openFunc={(tId: string) => setEditingTaskId(tId)}
                        key={list.id + progress}
                        progress={progress as 0 | 1 | 2}
                        list={list}
                        project={project}
                      />
                    ))}
                  </tr>
                ))}
              </TableBody>
            </table>
          </Paper>

          <DragOverlay dropAnimation={dropAnimationConfig}>
            {draggingId ? (
              <BaseTask
                project={project}
                task={project.tasks[id(project.tasks, draggingId)]}
                openFunc={() => null}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <SpeedDial
          open={fab}
          ariaLabel="create list/create task"
          onClick={() => setDialogOpen(true)}
          onClose={() => setFab(false)}
          onOpen={() => setFab(true)}
          color="primary"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
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

        {creating && (
          <CreateTask
            onClose={() => setCreating('')}
            project={project}
            listId={project.lists[0].id}
            columnId={creating}
          />
        )}
        {dialogOpen && (
          <CreateColumn
            onClose={() => setDialogOpen(false)}
            project={project}
          />
        )}

        <EditTaskModal
          open={Boolean(editingTaskId)}
          taskId={editingTaskId}
          onClose={() => setEditingTaskId('')}
          projectId={project.id}
        />
      </>
    )
  }
  return <NoMatch />
}
