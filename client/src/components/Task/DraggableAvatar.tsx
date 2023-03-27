import { TProjectUser, TTask } from '../../types/project'
import { HoverableAvatar } from '../HoverableAvatar'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

type Props = {
  task?: TTask
  user: TProjectUser
  noMargin?: boolean
}

const DraggableAvatar = ({ task, user, noMargin }: Props) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: task ? 'user|' + task.id + '|' + user.id : 'user|' + user.id
  })

  const style = {
    // using .Transform causes short elements to get stretched
    transform: CSS.Translate.toString(transform),
    display: 'flex'
  }

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <HoverableAvatar noMargin user={user} />
    </div>
  )
}

export default DraggableAvatar
