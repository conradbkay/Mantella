import React from 'react'
import { TList, TProject } from '../../../types/project'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { BaseTask } from '../Task/Base'
import { Button } from '@material-ui/core'
import { id } from '../../../utils/utilities'

type OwnProps = {
  progress: number // 0, 1, or 2
  list: TList
  project: TProject
}
type TProps = OwnProps

export const ProjectCell = (props: TProps) => {
  const tasks = props.list.taskIds
    .map(taskId => props.project.tasks[id(props.project.tasks, taskId)])
    .filter(task => task.progress === props.progress)

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
      <Droppable droppableId={`${props.list.id}DIVIDER${props.progress}`}>
        {(dropProvided, dropSnapshot) => {
          if (
            props.progress === 0 &&
            props.list.id === '6c1c7559-7c31-488e-b435-943d142a4ae7'
          ) {
            // console.log(dropProvided, dropSnapshot)
          }

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
                      openFunc={() => null}
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
        <Button style={{ width: '100%' }}>Create Task</Button>
      )}
    </td>
  )
}
