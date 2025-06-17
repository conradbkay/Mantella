import { Projects, Tasks, Lists } from './types-gen'

export type ApiSubtask = {
  id: string
  name: string
  completed: boolean
  orderIndex: number
}

export type ApiComment = {
  id: string
  comment: string
  dateAdded: string
  lastEdited?: string
}

export interface ApiTimeEstimate {
  value: number | null
  lowValue: number | null
  lowPercentile: number | null
  highValue: number | null
  highPercentile: number | null
}

export interface ApiTask {
  color: string
  createdAt?: string | null
  description?: string | null
  dueDate?: string | null
  id: string
  name: string
  points?: number | null
  projectId: string
  recurrenceInterval?: number | null
  recurrenceNextDue?: string | null
  securityAssignedUsers?: string | null
  securityPublic?: number | null
  timeEstimateHighPercentile?: number | null
  timeEstimateHighValue?: number | null
  timeEstimateLowPercentile?: number | null
  timeEstimateLowValue?: number | null
  timeEstimateValue?: number | null
  updatedAt?: string | null
  workedOnMs?: number | null
  assignedTo: string[]
  comments: ApiComment[]
  subTasks: ApiSubtask[]
}

export interface ApiList {
  createdAt?: string | null
  id: string
  name: string
  orderIndex: number
  projectId: string
  updatedAt?: string | null
  taskIds: string[][]
}

export interface ApiUser {
  id: string
  email: string
  profileImg?: string | null
  username: string
}

export interface ApiProject {
  colors?: string[] | null
  createdAt?: string | null
  id: string
  name: string
  ownerId: string
  securityPublic?: number | null
  updatedAt?: string | null
  tasks: ApiTask[]
  lists: ApiList[]
  users: ApiUser[]
}
