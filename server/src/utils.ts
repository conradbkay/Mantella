import { ProjectProps } from './models/Project'
import { Project } from './graphql/types'
import { UserModel } from './models/User'

export const purifyProjects = async (
  projects: ProjectProps[]
): Promise<Project[]> => {
  if (projects && projects.length) {
    const projs = await Promise.all(projects.map((proj) => purifyProject(proj)))

    return projs.filter((proj) => proj !== null) as Project[]
  }
  return []
}

export const purifyProject = async (
  proj: ProjectProps
): Promise<Project | null> => {
  const users = await UserModel.find({
    id: { $in: proj.users }
  })

  if (proj && users !== null) {
    return {
      ...proj.toObject(),
      users: users as any
    }
  }
  return null
}
