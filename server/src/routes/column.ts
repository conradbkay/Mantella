import { UserModel } from 'src/models/User'
import { MutationResolvers } from '../graphql/types'
import uuid from 'uuid'
import { ProjectModel } from 'src/models/Project'
import { AuthenticationError } from 'apollo-server-express'

const createColumn: MutationResolvers['createColumn'] = async (
  parent,
  args,
  context
) => {
  const creatingId = uuid()

  const [user, project] = await Promise.all([
    UserModel.findOne({ id: context.userId.id }),
    ProjectModel.findOne({ id: args.projId })
  ])

  if (user && project) {
    project.columns.push({
      inProgress: false,
      id: creatingId,
      name: args.name,
      collapsedUsers: []
    })
    const newProj = await project.save()
    return {
      project: newProj,
      column: newProj.columns.find((col) => col.id === creatingId)
    }
  }
  throw new AuthenticationError('user id not provided')
}

const toggleCollapsed: MutationResolvers['toggleCollapsed'] = async (
  parent,
  args,
  context
) => {
  const [user, project] = await Promise.all([
    UserModel.findOne({ id: context.userId.id }),
    await ProjectModel.findOne({ id: args.projId })
  ])

  if (user && project) {
    const col = project.columns.find((col) => col.id === args.colId)
    if (col) {
      const userIdInCollapsed = col.collapsedUsers.indexOf(context.userId.id)
      if (userIdInCollapsed > -1) {
        // user has column collapsed
        col.collapsedUsers.splice(userIdInCollapsed, 1)
      } else {
        col.collapsedUsers = [...col.collapsedUsers, context.user.id]
      }
      const newProj = await project.save()

      return { column: col, project: newProj }
    }
    throw new Error('column does not exist')
  }
  throw new AuthenticationError('user id not provided')
}

const deleteColumn: MutationResolvers['deleteColumn'] = async (
  parent,
  args,
  context
) => {
  const project = await ProjectModel.findOne({ id: args.projId })
  if (project) {
    if (project.columns.length <= 1) {
      throw new Error('trying to delete last column')
    }
    if (project.columns.find((col) => col.id === args.colId)!.inProgress) {
      throw new Error('Trying to delete in progress column')
    }
    project.columns = project.columns.filter((col) => col.id !== args.colId)
    await project.save()
    return { id: args.colId }
  }
  throw new Error('project no longer exists')
}

export const columnMutations = {
  createColumn,
  toggleCollapsed,
  deleteColumn
}
