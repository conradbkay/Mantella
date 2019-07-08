import { TColumn } from './../../types/project'

export const setColumnA = (args: {
  id: string
  projectId: string
  newCol: TColumn | null
}) => ({
  type: 'SET_COLUMN',
  id: args.id,
  projectId: args.projectId,
  newColumn: args.newCol
})

export type ColumnAction = ReturnType<typeof setColumnA>

// lol
