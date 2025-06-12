import { getDay } from 'date-fns'
import { BaseTask } from '../Task/Base'
import { getProjectIdFromTaskId, id } from '../../utils/utils'
import { useState } from 'react'
import { EditTaskModal } from '../Task/Edit'
import { TTask } from '../../types/project'
import { useAppSelector } from '../../store/hooks'
import { selectProjects } from '../../store/projects'

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  day: Date
  index: 0 | 1 | 2 | 3 | 4 | 5 | 6
  filteringProjects: string[]
  tasks: TTask[]
}

export const WeekDay = (props: Props) => {
  const { day, index, tasks } = props
  const [editingTaskId, setEditingTaskId] = useState('')
  const projects = useAppSelector(selectProjects)

  return (
    <div
      style={{
        borderRight: index !== 6 ? '1px solid #e0e0e0' : undefined,
        flex: '1 0 calc(1000px / 7)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          fontSize: '3.2rem',
          fontWeight: 300,
          margin: '0 0 0 .8rem',
          paddingBottom: '.4rem',
          color: sameDay(day, new Date()) ? '#4285f4' : '#555'
        }}
      >
        {day.getDate()}
        <div style={{ fontSize: '1.3rem' }}>{names[getDay(day)]}</div>
      </div>

      <div
        style={{
          marginTop: 93,
          height: '100%'
        }}
      >
        {tasks.map((task, i) => (
          <BaseTask
            project={
              projects[id(projects, getProjectIdFromTaskId(projects, task.id))]
            }
            openFunc={() => setEditingTaskId(task.id)}
            task={task}
          />
        ))}
      </div>
      {editingTaskId && (
        <EditTaskModal
          taskId={editingTaskId}
          onClose={() => setEditingTaskId('')}
          projectId={getProjectIdFromTaskId(projects, editingTaskId)}
        />
      )}
    </div>
  )
}
