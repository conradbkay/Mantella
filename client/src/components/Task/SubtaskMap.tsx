import CheckBox from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankOutlined from '@mui/icons-material/CheckBoxOutlineBlankOutlined'
import { animated, useTransition } from 'react-spring'
import { TSubtask } from '../../types/project'

export const SubtaskMap = ({
  subTasks,
  onCheckbox,
  show
}: {
  subTasks: TSubtask[]
  onCheckbox: (newSub: TSubtask) => void
  show: boolean
}) => {
  const transition = useTransition(subTasks, {
    from: { opacity: 1, height: 0, overflow: 'hidden' },
    enter: { opacity: 1, height: 'auto' },
    leave: { opacity: 0, height: 0, overflow: 'hidden' }
  })

  if (!show) {
    return null
  }

  return (
    <div style={{ marginLeft: 30 }}>
      {transition((style, subTask) => (
        <animated.div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...style
          }}
        >
          <div
            style={{
              marginTop: 6
            }}
          >
            {subTask.completed ? (
              <CheckBox
                onClick={(e) => {
                  e.stopPropagation()
                  onCheckbox({ ...subTask, completed: false })
                }}
              />
            ) : (
              <CheckBoxOutlineBlankOutlined
                onClick={(e) => {
                  e.stopPropagation()
                  onCheckbox({ ...subTask, completed: true })
                }}
              />
            )}
          </div>
          <span style={{ marginLeft: 8, userSelect: 'none' }}>
            {subTask.name}
          </span>
        </animated.div>
      ))}
    </div>
  )
}
