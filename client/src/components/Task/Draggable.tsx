import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  children: React.ReactNode
}

const DraggableTask = ({ id, children }: Props) => {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({
      id
    })

  const style = {
    // using CSS.Transform causes short elements to get stretched
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
