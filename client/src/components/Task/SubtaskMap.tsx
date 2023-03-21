import CheckBox from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankOutlined from '@mui/icons-material/CheckBoxOutlineBlankOutlined'
import { Transition, animated } from 'react-spring/renderprops'
import { TSubtask } from '../../types/project'

export const SubtaskMap = ({
  subTasks,
  onCheckbox,
  taskId,
  show
}: {
  subTasks: TSubtask[]
  onCheckbox: (newSub: TSubtask) => void
  taskId: string
  show: boolean
}) => (
  <div style={{ marginLeft: 30 }}>
    <Transition
      initial={null}
      native
      items={show ? subTasks : []}
      keys={show ? subTasks.map((subTask) => subTask.id) : []}
      from={{ opacity: 1, height: 0, overflow: 'hidden' }}
      enter={{ opacity: 1, height: 'auto' }}
      leave={{ opacity: 0, height: 0, overflow: 'hidden' }}
    >
      {(subTask) => (props) =>
        (
          <animated.div
            style={{
              display: 'flex',
              alignItems: 'center',
              ...props
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
            <span style={{ marginLeft: 8 }}>{subTask.name}</span>
          </animated.div>
        )}
    </Transition>
  </div>
)
