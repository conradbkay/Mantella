import { Column } from '../models/Project'
import { ProjectProps } from '../models/Project'
import { AuthenticationError } from 'apollo-server-core'
import { UserModel } from '../models/User'
import { MutationResolvers } from '../graphql/types'
import { ProjectModel } from '../models/Project'
import uuid from 'uuid'

const generateColumn = (
  name: string,
  id: string,
  isInProgress: boolean
): Column => ({
  id,
  name,
  collapsedUsers: [],
  inProgress: isInProgress,
  taskIds: []
})

const createProject: MutationResolvers['createProject'] = async (
  parent,
  args,
  context
) => {
  const creatingId = uuid()
  const listId = uuid()
  const user = await UserModel.findOne({ id: context.userId.id })

  if (user) {
    user.projects.push(creatingId)

    const [created] = await Promise.all([
      ProjectModel.create({
        id: creatingId,
        name: args.name,
        ownerId: user.id,
        users: [user.id],
        columns: [
          generateColumn('Created', uuid(), false),
          generateColumn('In Progress', uuid(), true),
          generateColumn('Created', uuid(), false)
        ],
        lists: [
          {
            id: listId,
            name: 'Generic',
            taskIds: []
          }
        ],
        tasks: [],
        enrolledUsers: [],
        columnOrder: [listId],
        isPrivate: false
      } as ProjectProps),
      user.save()
    ])
    if (created) {
      return created.toObject()
    }
  }

  throw new AuthenticationError('user id not provided in token')
}

const editProject: MutationResolvers['editProject'] = async (parent, args) => {
  if (args.id) {
    const project = await ProjectModel.findOne({ id: args.id })
    if (project) {
      project.name = args.newProj.name ? args.newProj.name : project.name

      const newProj = await project.save()

      if (newProj) {
        return newProj.toObject()
      }
    }
  }
  return null
}

const deleteProject: MutationResolvers['deleteProject'] = async (
  parent,
  obj,
  context
) => {
  const user = await UserModel.findOne({ id: context.userId.id })

  if (user) {
    user.projects = user.projects.filter((proj: any) => proj !== obj.id)
    if (!user.projects.length) {
      throw new Error('cannot delete only project')
    }
    await user.save()
  }

  const deleted = await ProjectModel.findOneAndDelete({ id: obj.id })

  if (deleted) {
    return {
      id: deleted.id
    }
  }
  throw new Error('proj not found')
}

const joinProject: MutationResolvers['joinProject'] = async (
  parent,
  obj,
  context
) => {
  const id = context.userId
  if (id.id) {
    const project = await ProjectModel.findOne({ id: obj.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }
    const user = await UserModel.findOneAndUpdate(
      { id: id.id },
      {
        $push: {
          projects: project.id
        }
      }
    )

    if (user) {
      return project.toObject()
    }
    throw new Error('could not join project')
  }
  throw new Error('User not signed in')
}

const leaveProject: MutationResolvers['leaveProject'] = async (
  parent,
  obj,
  context
) => {
  const id = context.userId
  if (id.id) {
    const project = await ProjectModel.findOne({ id: obj.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }
    const user = await UserModel.findOneAndUpdate(
      { id: id.id },
      {
        $pull: {
          projects: project.id
        }
      }
    )

    if (user) {
      return project.toObject()
    }
    throw new Error('could not join project')
  }
  throw new Error('User not signed in')
}

const removeMemberFromProject: MutationResolvers['removeMemberFromProject'] =
  async (parent, obj, context) => {
    const id = context.userId
    if (id.id) {
      const project = await ProjectModel.findOne({ id: obj.projectId })
      if (!project) {
        throw new Error('Project does not exist')
      }
      const user = await UserModel.findOneAndUpdate(
        { id: id.id },
        {
          $push: {
            projects: project
          }
        }
      )

      if (!user) {
        throw new Error('Session expired')
      }
      if (project.ownerId !== user.id) {
        throw new Error('You cannot kick members from this project')
      }

      project.users.splice(project.users.indexOf(obj.userId), 1)
      const deletingUser = await UserModel.findOne({ id: obj.userId })
      if (!deletingUser) {
        throw new Error('user being kicked does not exist')
      }
      deletingUser.projects = deletingUser.projects.filter(
        (proj: any) => proj !== project.id
      )
      await deletingUser.save()

      return project.toObject()
    }
    throw new Error('User not signed in')
  }

export const projectMutations = {
  createProject,
  editProject,
  deleteProject,
  joinProject,
  leaveProject,
  removeMemberFromProject
}
