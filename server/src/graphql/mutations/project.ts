import { UserModel } from './../../models/User'
import { MutationResolvers } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'
import { purifyProject } from '../../utils'
import { Types } from 'mongoose'

const createProject: MutationResolvers['createProject'] = async (
  parent,
  args,
  context
) => {
  const creatingId = Types.ObjectId()
  const colId = Types.ObjectId()

  const [created] = await Promise.all([
    ProjectModel.create({
      _id: creatingId,
      name: args.name,
      ownerId: context.user._id,
      users: [],
      swimlanes: [],
      columns: [
        {
          _id: colId,
          name: 'Todo',
          isCompletedColumn: false,
          taskIds: [],
          taskLimit: 0
        }
      ],
      tasks: [],
      enrolledUsers: [],
      columnIds: [colId.toHexString()]
    }),
    UserModel.findByIdAndUpdate(context.user.id, {
      $push: {
        projects: creatingId
      }
    })
  ])

  if (created) {
    return await purifyProject(created)
  }
  return null
}

const editProject: MutationResolvers['editProject'] = async (parent, args) => {
  if (args.id) {
    const project = await ProjectModel.findById(args.id)
    if (project) {
      project.name = args.newProj.name ? args.newProj.name : project.name
      project._id = Types.ObjectId(args.id)
      project.columnIds = args.newProj.columnIds
        ? args.newProj.columnIds
        : project.columnIds

      const newProj = await project.save()

      if (newProj) {
        return await purifyProject(newProj)
      }
    }
  }
  return null
}

const deleteProject: MutationResolvers['deleteProject'] = async (
  parent,
  obj
) => {
  const deleted = await ProjectModel.findByIdAndDelete(obj.id)

  if (deleted) {
    return {
      id: deleted._id
    }
  }
  return null
}

const joinProject: MutationResolvers['joinProject'] = async () => {
  return null
}

const leaveProject: MutationResolvers['leaveProject'] = async () => {
  return null
}

const removeMemberFromProject: MutationResolvers['removeMemberFromProject'] = async () => {
  return null as any
}

export const projectMutations = {
  createProject,
  editProject,
  deleteProject,
  joinProject,
  leaveProject,
  removeMemberFromProject
}
