import { findProjectById, getProjectLists, getProjectTasks } from './project'
import { ApiProject, ApiList, ApiTask, ApiUser } from '../shared/types'
import { db } from './db'

export async function getFullProject(
  projectId: string
): Promise<ApiProject | null> {
  const project = await findProjectById(projectId)
  if (!project) {
    return null
  }

  const [tasks, lists] = await Promise.all([
    getProjectTasks(projectId),
    getProjectLists(projectId)
  ])

  const users = await db
    .selectFrom('projectUsers as pu')
    .innerJoin('users as u', 'pu.userId', 'u.id')
    .select(['u.id', 'u.username', 'u.email', 'u.profileImg'])
    .where('pu.projectId', '=', project.id)
    .execute()

  const apiUsers: ApiUser[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    profileImg: user.profileImg
  }))

  return {
    ...project,
    colors: project.colors ? JSON.parse(project.colors) : [],
    tasks,
    lists,
    users: apiUsers
  }
}
