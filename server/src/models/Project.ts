import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
@modelOptions({ options: { allowMixed: 0 } })
export class Project {
  @prop({ index: true, unique: true })
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
    // Time estimates in hours (fractional allowed)
    timeEstimate?: {
      estimate: number // The main estimate (always 50th percentile)
      low: { value?: number; percentile: number } // Optional low-end estimate
      high: { value?: number; percentile: number } // Optional high-end estimate
    }
    workedOnMs: number
    color: string
    createdAt: string
    dueDate?: string
    comments: Array<{
      comment: string
      dateAdded: string
      lastEdited?: string
      id: string
    }>
    assignedTo: string[]
    subTasks: Array<{ name: string; completed: boolean; id: string }>
    recurrance?: { interval?: number; nextDue?: string }
    description?: string
  }>
  @prop()
  public history!: Array<{}> // most recent first
  @prop()
  public users!: Array<{
    id: string
    roles: string[]
  }>
  @prop()
  public security?: { public: boolean }
  @prop()
  public channels!: [string, string][] // id, name
  @prop()
  public roles!: [
    {
      id: string
      color: string
      name: string
    }
  ]
  @prop()
  public data!: {}
  @prop()
  public colors!: string[]
}

export type Task = Project['tasks'][0]

export const ProjectModel = getModelForClass(Project)
