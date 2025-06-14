export type TProjectUser = {
  id: string
  roles: string[]
  // These fields are resolved dynamically from the User model
  username?: string
  email?: string
  profileImg?: string
}

export type TRole = {
  id: string
  name: string
  color: string
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
  // Time estimates in hours (fractional allowed)
  timeEstimate?: {
    estimate: number // The main estimate (always 50th percentile)
    low: { value?: number; percentile: number } // Optional low-end estimate
    high: { value?: number; percentile: number } // Optional high-end estimate
  }
  workedOnMs: number
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

export type TComment = TTask['comments'][0]
export type TSubtask = TTask['subTasks'][0]
export type TList = TProject['lists'][0]
