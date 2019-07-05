import { Schema, model, Model, Document } from 'mongoose'

export const ProjectSchema = new Schema({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId },
  swimlanes: [
    {
      taskIds: [String],
      name: { type: String, required: true }
    }
  ],
  columns: [
    {
      name: { type: String, required: true },
      isCompletedColumn: Boolean,
      taskIds: [String],
      taskLimit: Number
    }
  ],
  tasks: [
    {
      name: { type: String, required: true },
      points: { type: Number, required: true },
      completed: { type: Boolean, required: true },
      timeWorkedOn: { type: Number, required: true },
      color: { type: String, required: true },
      dueDate: Date,
      assignedUsers: [{ type: Schema.Types.ObjectId, required: true }],
      startDate: Date,
      tags: [String],
      comments: [
        {
          description: { type: String, required: true },
          dateAdded: { type: Date, required: true },
          lastEdited: Date
        }
      ],
      subTasks: [
        {
          name: { type: String, required: true },
          completed: { type: Boolean, required: true }
        }
      ],
      description: String,
      recurrance: String
    }
  ],
  users: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
  isPrivate: Boolean,
  tags: [
    {
      name: { type: String, required: true },
      color: String
    }
  ],
  columnIds: [String]
})

export interface TaskProps extends Document {
  name: string
  points: number
  completed: boolean
  timeWorkedOn: number
  color: string
  dueDate?: Date
  assignedUsers: Array<typeof Schema.Types.ObjectId>
  startDate?: Date
  tags: string[]
  comments: Array<{
    description: string
    dateAdded: Date
    lastEdited?: Date
    id: string
  }>
  subTasks: Array<{
    name: string
    completed: boolean
    id: string
  }>
  description?: string
  recurrance?: string
  id: string
}

export interface ProjectProps extends Document {
  columnIds: string[]
  name: string
  ownerId: typeof Schema.Types.ObjectId
  swimlanes: Array<{
    taskIds: string[]
    name: string
    id: string
  }>
  columns: Array<{
    name: string
    isCompletedColumn?: boolean
    taskIds: string[]
    taskLimit?: number
    id: string
  }>
  tasks: TaskProps[]
  users: Array<typeof Schema.Types.ObjectId>
  isPrivate?: boolean
  tags: Array<{
    name: string
    color?: string
    id: string
  }>
  id: string
}

export const ProjectModel: Model<ProjectProps> = model(
  'Project',
  ProjectSchema,
  'Projects'
)
