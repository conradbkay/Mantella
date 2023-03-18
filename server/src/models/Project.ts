import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
@modelOptions({ options: { allowMixed: 0 } })
export class Project {
  @prop()
  public id!: string
  @prop()
  public name!: string
  @prop()
  public ownerId?: string
  @prop()
  public lists!: Array<{
    taskIds: [string[], string[], string[]]
    name: string
    id: string
  }>
  @prop()
  public tasks!: Array<{
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
    assignedTo: string[] // ids
    subTasks: Array<{ name: string; completed: boolean; id: string }>
    recurrance?: { interval?: number; nextDue?: string }
    description?: string
  }>
  @prop()
  public history!: Array<{}> // most recent first
  @prop()
  public users!: Array<{
    id: string
    profileImg: string
    username: string
    email: string
  }>
  @prop()
  public security?: { public: boolean; assignedUsers: Array<string> }
}

export type Task = Project['tasks'][0]

export const ProjectModel = getModelForClass(Project)
