import { getModelForClass, prop } from '@typegoose/typegoose'

class ProjectClass {
  @prop()
  public id!: string
  @prop()
  public name!: string
  @prop()
  public ownerId?: string
  @prop()
  public lists!: Array<{ taskIds: string[]; name: string; id: string }>
  @prop()
  public columns!: Array<{
    id: string
    name: string
    collapsedUsers: string[]
    inProgress?: boolean
    taskIds: string[]
  }>
  @prop()
  public tasks!: Array<{
    progress?: 0 | 1 | 2
    security?: { public: boolean; assignedUsers: string[] }
    id: string
    name: string
    points: number
    timeWorkedOn: number
    color: string
    dueDate?: string
    comments: Array<{
      comment: string
      dateAdded: string
      lastEdited?: string
      id: string
    }>
    subTasks: Array<{ name: string; completed: boolean; id: string }>
    recurrance?: { interval?: number; nextDue?: string }
    description: string
  }>
  @prop()
  users!: string[]
  @prop()
  security?: { public: boolean; assignedUsers: string[] }
}

export const ProjectModel = getModelForClass(ProjectClass)
