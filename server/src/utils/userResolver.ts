import { UserModel } from '../models/User'

// Function to resolve user information from User model and merge with project roles
export const resolveUsers = async (
  projectUsers: Array<{ id: string; roles: string[] }>
) => {
  if (!projectUsers || projectUsers.length === 0) {
    return []
  }

  const userIds = projectUsers.map((pu) => pu.id)
  const users = await UserModel.find({ id: { $in: userIds } })

  return projectUsers.map((projectUser) => {
    const fullUser = users.find((u) => u.id === projectUser.id)
    return {
      ...fullUser,
      id: projectUser.id,
      roles: projectUser.roles,
      password: undefined,
      projects: undefined
    }
  })
}

// Function to resolve a single project's users
export const resolveProjectUsers = async (project: any) => {
  const resolvedUsers = await resolveUsers(project.users)
  return {
    ...project,
    users: resolvedUsers
  }
}
