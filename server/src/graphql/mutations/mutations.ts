import { authMutations } from './auth'
import { MutationResolvers } from '../../graphql/types'
import { columnMutations } from './column'
import { taskMutations } from './task'
import { projectMutations } from './project'
import { swimlaneMutations } from './swimlane'

export const mutations: MutationResolvers = {
  ...columnMutations,
  ...taskMutations,
  ...projectMutations,
  ...swimlaneMutations,
  ...authMutations
}
