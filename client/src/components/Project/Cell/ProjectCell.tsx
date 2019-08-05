import React, { useState } from 'react'
import { TList, TProject } from '../../../types/project'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { BaseTask } from '../Task/Base'
import { Button } from '@material-ui/core'
import { id } from '../../../utils/utilities'
import { CreateTask } from '../Task/Create'

type OwnProps = {
  progress: number // 0, 1, or 2
  list: TList
  project: TProject
  openFunc: (id: string) => void
}
type TProps = OwnProps

export const ProjectCell = (props: TProps) => {
  const tasks = props.list.taskIds
    .map(taskId => props.project.tasks[id(props.project.tasks, taskId)])
    .filter(task => task.progress === props.progress)

  const [creating, setCreating] = useState(false)

  return (
    <td
      style={{
        borderRight: `1px ${props.progress !== 2 ? 'dashed' : 'solid'} #aebacc`,
        borderBottom:
          props.project.lists.findIndex(list => props.list.id === list.id) ===
          props.project.lists.length - 1
            ? '1px solid #aebacc'
            : undefined,
        borderTop: '1px solid #aebacc',
        borderLeft:
          props.progress === 0
            ? `1px ${props.progress ? 'dashed' : 'solid'} #aebacc`
            : undefined,
        overflowY: 'scroll',
        width: '100%',
        padding: 8
      }}
    >
      {props.progress === 0 && (
        <h2 style={{ marginBottom: 8 }}>{props.list.name}</h2>
      )}
      <Droppable droppableId={`${props.list.id}DIVIDER${props.progress}`}>
        {(dropProvided, dropSnapshot) => {
          return (
            <div
              style={{
                flexDirection: 'column',
                display: 'flex',
                minHeight: 78,
                backgroundColor: dropSnapshot.isDraggingOver
                  ? '#bae3ff'
                  : 'white',
                transition: 'background-color .2s ease'
              }}
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
            >
              {tasks.map((task, i) => (
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
              ))}
              {dropProvided.placeholder}
            </div>
          )
        }}
      </Droppable>
      {props.progress === 0 && (
        <Button
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => setCreating(true)}
        >
          Create Task
        </Button>
      )}
      {creating && (
        <CreateTask
          onClose={() => setCreating(false)}
          projectId={props.project.id}
        />
      )}
    </td>
  )
}
