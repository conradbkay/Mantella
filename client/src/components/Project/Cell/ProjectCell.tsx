import React from 'react'
import { TList, TProject } from '../../../types/project'
import { Droppable } from 'react-beautiful-dnd'

type OwnProps = {
  progress: number // 0, 1, or 2
  list: TList
  project: TProject
}
type TProps = OwnProps

export const ProjectCell = (props: TProps) => {
  return (
    <Droppable droppableId={props.list.id}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          style={{
            border: '1px solid gray',
            flexDirection: 'column',
            display: 'flex',
            width: '100%',
            minHeight: 78,
            backgroundColor: snapshot.isDraggingOver ? '#bae3ff' : 'white',
            transition: 'background-color .2s ease'
          }}
          ref={provided.innerRef}
        >
          <div></div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
