import { v4 as uuid } from 'uuid'
import { Project, Task } from './models/Project'

export const defaultTask = {
  name: 'Task',
  points: 0,
  subTasks: [],
  timeWorkedOn: 0,
  comments: [],
  color: '#FFFFFF',
  assignedTo: [],
  createdAt: new Date().toString()
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

export const taskObjects = (ids: string[]): Task[] => [
  {
    ...defaultTask,
    id: ids[0],
    name: 'Welcome To Mantella!'
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
    name: 'Projects can be created at any time, you can have as many projects as you want!'
  },
  {
    ...defaultTask,
    id: ids[5],
    name: 'You can add colors to Tasks',
    color: '#005BD2'
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
    name: 'I hope you enjoy Mantella, email me with feature requests or bugs, I appreciate all feedback!'
  }
]

export const generateIds = (length: number): string[] => {
  let ids = []
  for (let i = 0; i < length; i++) {
    ids.push(uuid())
  }
  return ids
}

export const generateDefaultProject = (
  newUser: {
    email: string
    id: string
    profileImg: string
    username: string
  },
  projectId: string,
  chat: [string, string]
): Project => {
  const listIds = [uuid(), uuid(), uuid()]
  const roleId = uuid()
  const ids = generateIds(16)
  const tasks = taskObjects(ids)
  return {
    channels: [chat],
    history: [],
    name: 'Tutorial Project',
    lists: [
      {
        id: listIds[0],
        name: 'Fundementals',
        taskIds: [[ids[0], ids[1], ids[2], ids[3], ids[4], ids[5]], [], []]
      },
      {
        id: listIds[1],
        name: 'Setting Up',
        taskIds: [[ids[6], ids[7], ids[8], ids[9]], [], []]
      },
      {
        id: listIds[2],
        name: 'Other Features',
        taskIds: [
          [ids[10], ids[11], ids[12], ids[13], ids[14], ids[15]],
          [],
          []
        ]
      }
    ],
    security: {
      public: true
    },
    ownerId: newUser.id,
    id: projectId,
    tasks: tasks,
    users: [{ ...newUser, roles: [roleId] }],
    roles: [
      {
        id: roleId,
        name: 'Admin',
        color: '#FF0000'
      }
    ],
    data: {}
  }
}

export const generateGuestUser = (projectId: string, userId: string) => {
  return {
    id: userId,
    email: uuid() + '.gmail.com',
    username: 'Guest',
    projects: [projectId],
    guest: true,
    profileImg:
      'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
  }
}
