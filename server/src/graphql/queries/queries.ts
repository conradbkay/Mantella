import { QueryResolvers } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'

import { UserModel } from '../../models/User'
import mongoose from 'mongoose'
import { purifyProject, purifyProjects } from '../../utils'

export const queries: QueryResolvers = {
  projects: async (obj, args, context, info) => {
    const projects = await ProjectModel.find({
      _id: {
        $in: args.ids.map((id: string) => mongoose.Types.ObjectId(id))
      }
    })

    return (await purifyProjects(projects)) || []
  },
  projectById: async (obj, args, context, info) => {
    const proj = await ProjectModel.findById(args.id)

    if (proj) {
      return await purifyProject(proj)
    }

    return null
  },
  user: async (obj, args, context) => {
    const user = await UserModel.findById(args.id)

    if (user) {
      const userWithProjects = await user.populate('projects').execPopulate()

      const newProjects = await purifyProjects(userWithProjects.projects)

      const returning = {
        ...user.toObject(),
        projects: newProjects
      }

      return returning
    }
    return null
  }
}
