export const setListA = (args: {
  id: string
  projectId: string
  newList: { taskIds?: [string[], string[], string[]]; name?: string } | null
}) => ({
  type: 'SET_LIST',
  id: args.id,
  projectId: args.projectId,
  newList: args.newList
})

export const setListIdxA = (args: {
  id: string
  offset: number
  projectId: string
}) => ({
  type: 'SET_LIST_IDX',
  id: args.id,
  offset: args.offset,
  projectId: args.projectId
})

export type ListAction =
  | ReturnType<typeof setListA>
  | ReturnType<typeof setListIdxA>
