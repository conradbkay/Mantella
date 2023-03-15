import { useSortable } from '@dnd-kit/sortable'
import { TTask } from '../../../types/project'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  task: TTask
  children: React.ReactNode
}

const DraggableTask = ({ task, children }: Props) => {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({
      id: task.id
    })

  const style = {
    // using .Transform causes short elements to get stretched
    transform: CSS.Translate.toString(transform),
    transition
  }
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  )
}

export default DraggableTask
