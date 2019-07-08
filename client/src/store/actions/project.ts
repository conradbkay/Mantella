import { TProject } from './../../types/project'

export const setProjectsA = (projects: TProject[]) => ({
  type: 'SET_PROJECTS',
  projects
})

export const setProjectA = (args: {
  id: string
  newProj: TProject | null
}) => ({
  type: 'SET_PROJECT',
  id: args.id,
  project: args.newProj
})

export const setSwimlaneA = (args: {
  id: string
  projectId: string
  newSwimlane: TProject['swimlanes'][0] | null
}) => ({
  type: 'SET_SWIMLANE',
  id: args.id,
  projectId: args.projectId,
  swimlane: args.newSwimlane
})

export const selectMemberA = (args: { projectId: string; id: string }) => ({
  type: 'SELECT_MEMBER',
  id: args.id,
  projectId: args.projectId
})

export type ProjectAction =
  | ReturnType<typeof setProjectsA>
  | ReturnType<typeof setProjectA>
  | ReturnType<typeof setSwimlaneA>
  | ReturnType<typeof selectMemberA>
