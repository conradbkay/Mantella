export type TProjectUser = {
  username: string
  email: string
  id: string
  profileImg: string
}

export type TRole = {
  name: string
  color: string
  id: string
}

export interface TProject {
  colors: string[]
  id: string
  channels: [string, string][] // id, name
  name: string
  ownerId: string
  lists: Array<{
    taskIds: [string[], string[], string[]]
    name: string
    id: string
  }>

  tasks: TTask[]

  roles: TRole[]

  users: TProjectUser[]

  security?: {
    public: boolean
  } | null
}

export interface TTask {
  progress: 0 | 1 | 2 | number
  description?: string | null
  id: string
  name: string
  points: number
  timeWorkedOn: number
  color: string
  createdAt: string // date
  dueDate?: string | null // date
  assignedTo: string[]
  comments: Array<{
    id: string
    comment: string
    dateAdded: string
    lastEdited?: string | null // date
  }>
  subTasks: Array<{
    name: string
    completed: boolean
    id: string
  }>
  recurrance?: {
    interval?: number | null
    nextDue?: string | null // date
  } | null
}

export type TList = TProject['lists'][0]

export type TComment = TTask['comments'][0]

export type TSubtask = TTask['subTasks'][0]
