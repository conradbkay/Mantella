import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { TTask } from '../../../types/project'
import { BaseTask } from './Base'
import { TProject } from '../../../types/project'

export interface TaskOwnProps {
  task: TTask
  index: number
  project: TProject
  isCompletedColumn?: boolean
}
type TaskProps = TaskOwnProps

export const ColumnTask = (props: TaskProps) => {
  const [open, setOpen] = useState(false)

  console.log(open)

  const { task, index, isCompletedColumn } = props
  return task ? (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <BaseTask
            project={props.project}
            openFunc={() => setOpen(true)}
            task={task}
            provided={provided}
            snapshot={snapshot}
            isCompletedColumn={isCompletedColumn}
          />
        )}
      </Draggable>
      {/*open && (
        <TaskModal
          task={task}
          onClose={() => setOpen(false)}
          projectId={props.project.id}
        />
      )*/}
    </>
  ) : null
}
