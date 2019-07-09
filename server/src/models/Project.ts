import { Schema, model, Model, Document } from 'mongoose'

export const ProjectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  ownerId: String,
  swimlanes: [
    {
      taskIds: [String],
      name: { type: String, required: true },
      id: { type: String, required: true }
    }
  ],
  columns: [
    {
      name: { type: String, required: true },
      isCompletedColumn: Boolean,
      taskLimit: { type: Number, required: true }, // 0 if no limit
      id: { type: String, required: true },
      taskIds: [String]
    }
  ],
  columnOrder: [String],
  tasks: [
    {
      security: {
        public: Boolean,
        assignedUsers: [String]
      },

      id: { type: String, required: true },
      name: { type: String, required: true },
      points: { type: Number, required: true },
      completed: { type: Boolean, required: true },
      timeWorkedOn: { type: Number, required: true },
      color: { type: String, required: true },
      dueDate: Date,
      startDate: Date,
      comments: [
        {
          comment: { type: String, required: true },
          dateAdded: { type: Date, required: true },
          lastEdited: Date,
          id: String
        }
      ],
      subTasks: [
        {
          name: { type: String, required: true },
          completed: { type: Boolean, required: true },
          id: { type: String, required: true }
        }
      ],
      recurrance: {
        interval: Number,
        nextDue: Date
      }
    }
  ],
  users: [String],
  isPrivate: Boolean
})

export interface TaskProps {
  security: {
    public: boolean
    assignedUsers: string[] // teams or users
  }

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
  }
}

export interface ProjectProps {
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

  tasks: TaskProps[]

  users: string[]

  isPrivate: boolean
}

export const ProjectModel: Model<Document & ProjectProps> = model(
  'Project',
  ProjectSchema,
  'Projects'
)
