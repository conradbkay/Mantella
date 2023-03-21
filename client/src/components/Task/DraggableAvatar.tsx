import { useDraggable } from '@dnd-kit/core'
import { TProjectUser, TTask } from '../../types/project'
import { HoverableAvatar } from '../utils/HoverableAvatar'

type Props = {
  task?: TTask
  user: TProjectUser
}

const DraggableAvatar = ({ task, user }: Props) => {
  const { setNodeRef } = useDraggable({
    id: task ? task.id : user.id,
    data: {
      type: 'user'
    }
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex'
      }}
    >
      <HoverableAvatar user={user} />
    </div>
  )
}

export default DraggableAvatar
