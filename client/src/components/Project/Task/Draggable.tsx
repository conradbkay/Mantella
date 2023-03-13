import { useDraggable } from '@dnd-kit/core'
import { TTask } from '../../../types/project'

type Props = {
  task: TTask
  children: React.ReactNode
}

const DraggableTask = ({ task, children }: Props) => {
  const { setNodeRef } = useDraggable({ id: task.id })

  return <div ref={setNodeRef}>{children}</div>
}

export default DraggableTask
