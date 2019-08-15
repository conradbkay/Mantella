import { Schema, model, Model, Document } from 'mongoose'

export const ProjectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  ownerId: String,
  lists: [
    {
      taskIds: [String],
      name: { type: String, required: true },
      id: { type: String, required: true }
    }
  ],
  tasks: [
    {
      progress: { type: Number, required: true }, // 0 for none, 1 for in-progress, 2 for complete
      security: {
        public: Boolean,
        assignedUsers: [String]
      },
      id: { type: String, required: true },
      name: { type: String, required: true },
      points: { type: Number, required: true },
      timeWorkedOn: { type: Number, required: true },
      color: { type: String, required: true },
      dueDate: String,
      comments: [
        {
          comment: { type: String, required: true },
          dateAdded: { type: String, required: true },
          lastEdited: String,
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
        nextDue: String
      }
    }
  ],
  users: [String],
  security: {
    public: { type: Boolean, assignedUsers: { type: [String], required: true } }
  }
})

export interface TaskProps {
  progress: 0 | 1 | 2

  id: string
  name: string
  points: number
  timeWorkedOn: number
  color: string
  dueDate?: string | null

  comments: Array<{
    id: string
    comment: string
    dateAdded: string
    lastEdited?: string | null
  }>
  subTasks: Array<{
    name: string
    completed: boolean
    id: string
  }>
  recurrance?: {
    interval: number
    nextDue: string
  } | null
}

export interface ProjectProps {
  id: string
  name: string
  ownerId: string
  lists: Array<{
    taskIds: string[]
    name: string
    id: string
  }>

  tasks: TaskProps[]

  users: string[]

  security?: {
    public: boolean
    assignedUsers: string[]
  } | null
}

export const ProjectModel: Model<Document & ProjectProps> = model(
  'Project',
  ProjectSchema,
  'Projects'
)
