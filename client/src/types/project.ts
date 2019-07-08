export type TProject = {
  id: string
  name: string
  ownerId: string
  swimlanes: Array<{
    taskIds: string[]
    name: string
    id: string
  }>
  columns: Array<{
    name: string
    taskIds: string[]
    taskLimit: number
    id: string
  }>

  columnOrder: string[]

  tasks: Array<{
    security:
      | {
          public: boolean
          assignedUsers: string[] // teams or users
        }
      | null
      | undefined

    id: string
    name: string
    points: number
    completed: boolean
    timeWorkedOn: number
    color: string
    dueDate?: Date
    startDate?: Date

    comments: Array<{
      id: string
      comment: string
      dateAdded: string
      lastEdited?: Date
    }>
    subTasks: Array<{
      name: string
      completed: boolean
      id: string
    }>
    recurrance?: {
      interval: number
      nextDue: Date
    } | null
  }>

  users: string[] // null if private

  isPrivate: boolean
}

export type TSwimlane = TProject['swimlanes'][0]

export type TColumn = TProject['columns'][0]

export type TTask = TProject['tasks'][0]

export type TComment = TTask['comments'][0]

export type TSubtask = TTask['subTasks'][0]
