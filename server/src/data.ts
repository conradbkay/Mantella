import { TaskProps, ProjectProps } from './models/Project'
import { DeepPartial } from 'apollo-env'
import uuid from 'uuid'

export const defaultTask: Partial<TaskProps> = {
  name: 'Task',
  completed: false,
  points: 0,
  tags: [],
  subTasks: [],
  timeWorkedOn: 0,
  comments: [],
  assignedUsers: [],
  color: '#FFFFFF'
}

export const tags = [
  { name: 'error', color: '#ffccd6' },
  {
    name: 'review',
    color: '#ffe7b6'
  },
  {
    name: 'important',
    color: '#c3ddff'
  }
]

export const taskObjects = (ids: any[]): Array<Partial<TaskProps>> => [
  {
    ...defaultTask,
    id: ids[0],
    name: 'Welcome To KanbanBrawn!'
  },
  { ...defaultTask, id: ids[1], name: 'This is a Task, click on it!' },
  {
    ...defaultTask,
    id: ids[2],
    name: 'Tasks are part of lists, drag this task into another list'
  },
  {
    ...defaultTask,
    id: ids[3],
    name: 'Lists can be assigned to projects and reordered'
  },
  {
    ...defaultTask,
    id: ids[4],
    name:
      'Projects can be created at any time, you can have as many projects as you want!'
  },
  {
    ...defaultTask,
    id: ids[5],
    name: 'You can add colors to Tasks',
    color: '#c3ddff'
  },
  {
    ...defaultTask,
    id: ids[6],
    name: 'Tasks can be assigned a Point importance',
    points: 2
  },
  {
    ...defaultTask,
    id: ids[7],
    name: 'Create a list by pressing the large + button within a project'
  },
  {
    ...defaultTask,
    id: ids[8],
    name: 'Tasks can be dragged into different lists or reordered within a list'
  },
  {
    ...defaultTask,
    id: ids[9],
    name: 'You can add, delete, and edit comments to Tasks'
  },
  {
    ...defaultTask,
    id: ids[10],
    name: 'Tasks can include subTasks',
    subTasks: [{ name: 'This is a subtask!', completed: false, id: uuid() }]
  },
  {
    ...defaultTask,
    id: ids[11],
    name: 'You can invite members to projects and see who is online'
  },
  {
    ...defaultTask,
    id: ids[12],
    name: 'All board activity will be logged, in Beta'
  },
  {
    ...defaultTask,
    id: ids[13],
    name: 'Log time on Tasks by clicking the pomodoro tab button'
  },
  {
    ...defaultTask,
    id: ids[14],
    name: 'Tasks can be assigned to one or more people!'
  },
  {
    ...defaultTask,
    id: ids[15],
    name:
      'I hope you enjoy KanbanBrawn, email me with feature requests or bugs, I appreciate all feedback!'
  }
]

export const projectData = (
  ids: any[],
  tasks: DeepPartial<ProjectProps['tasks']>,
  newUserId: any,
  projectId: any,
  columnIds: any[]
): Partial<ProjectProps> => ({
  name: 'Tutorial Project',
  swimlanes: [
    { taskIds: [], name: 'Intermediate', id: uuid() },
    { name: 'Beginner', taskIds: [ids[2], ids[4], ids[3]], id: uuid() },
    { taskIds: [ids[6]], name: 'Advanced', id: uuid() }
  ],
  columns: [
    {
      id: columnIds[0],
      name: 'Fundementals',
      isCompletedColumn: false,
      taskIds: [ids[0], ids[1], ids[2], ids[3], ids[4], ids[5]]
    } as any,
    {
      id: columnIds[1],
      name: 'Setting Up',
      isCompletedColumn: false,
      taskIds: [ids[6], ids[7], ids[8], ids[9]]
    } as any,
    {
      id: columnIds[2],
      name: 'Other Features',
      isCompletedColumn: true,
      taskIds: [ids[10], ids[11], ids[12], ids[13], ids[14]]
    } as any
  ],
  columnIds: columnIds,
  ownerId: newUserId,
  id: projectId,
  tasks: tasks as any,
  users: [newUserId]
})
