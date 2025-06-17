import { z } from 'zod'
import { findUserByEmail } from '../db/user'
import {
  createProject as createProjectDb,
  findProjectById,
  addUserToProject,
  deleteProject as deleteProjectDb,
  updateProject as updateProjectDb,
  findProjectsByUserId
} from '../db/project'
import { nanoid } from 'nanoid'
import { Request, Response, NextFunction } from 'express'
import { defaultColors } from '../data'
import { db } from '../db/db'
import { getFullProject } from '../db/toApi'
import { validateRequest } from '../middleware/validate'

// Zod validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  public: z.boolean().optional()
})

const editProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  newProj: z.object({
    name: z.string().optional(),
    colors: z.array(z.string()).optional()
  })
})

const deleteProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required')
})

const leaveProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required')
})

const removeMemberSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  userId: z.string().min(1, 'User ID is required')
})

const shareProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  email: z.string().email('Valid email is required')
})

const getProjectByIdSchema = z.object({
  id: z.string().min(1, 'Project ID is required')
})

const getProjectMembersSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required')
})

export const validateCreateProject = validateRequest(createProjectSchema)
export const validateEditProject = validateRequest(editProjectSchema)
export const validateDeleteProject = validateRequest(deleteProjectSchema)
export const validateLeaveProject = validateRequest(leaveProjectSchema)
export const validateRemoveMember = validateRequest(removeMemberSchema)
export const validateShareProject = validateRequest(shareProjectSchema)
export const validateGetProjectById = validateRequest(getProjectByIdSchema)
export const validateGetProjectMembers = validateRequest(
  getProjectMembersSchema
)

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, public: isPublic } = createProjectSchema.parse(req.body)
    const user = req.user as any
    const listId = nanoid()

    const created = await createProjectDb({
      name,
      ownerId: user.id,
      colors: defaultColors,
      securityPublic: isPublic || false
    })

    await addUserToProject(created.id!, user.id)

    await db
      .insertInto('lists')
      .values({
        id: listId,
        projectId: created.id!,
        name: 'Generic',
        orderIndex: 0
      })
      .execute()

    const fullProject = await getFullProject(created.id!)
    res.json({ project: fullProject })
  } catch (error) {
    next(error)
  }
}

export const editProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, newProj } = editProjectSchema.parse(req.body)

    const updates: { name?: string; colors?: string } = {}
    if (newProj.name) {
      updates.name = newProj.name
    }
    if (newProj.colors) {
      updates.colors = JSON.stringify(newProj.colors)
    }

    await updateProjectDb(id, updates)
    const fullProject = await getFullProject(id)
    res.json({ project: fullProject })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = deleteProjectSchema.parse(req.body)
    await deleteProjectDb(id)
    res.json({ id })
  } catch (error) {
    next(error)
  }
}

export const leaveProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = leaveProjectSchema.parse(req.body)
    const user = req.user as any

    await db
      .deleteFrom('projectUsers')
      .where('projectId', '=', projectId)
      .where('userId', '=', user.id)
      .execute()

    res.json({ message: 'Successfully left project' })
  } catch (error) {
    next(error)
  }
}

export const kickUserFromProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, userId } = removeMemberSchema.parse(req.body)
    await db
      .deleteFrom('projectUsers')
      .where('projectId', '=', projectId)
      .where('userId', '=', userId)
      .execute()

    const fullProject = await getFullProject(projectId)
    res.json({ project: fullProject })
  } catch (error) {
    next(error)
  }
}

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = getProjectByIdSchema.parse(req.body)
    const project = await getFullProject(id as string)
    res.json({ project })
  } catch (error) {
    next(error)
  }
}

export const shareProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, email } = shareProjectSchema.parse(req.body)
    const userToShareWith = await findUserByEmail(email)

    if (!userToShareWith) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    await addUserToProject(projectId, userToShareWith.id!)
    const fullProject = await getFullProject(projectId)
    res.json({ project: fullProject })
  } catch (error) {
    next(error)
  }
}

export const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = getProjectMembersSchema.parse(req.body)
    const project = await getFullProject(projectId as string)
    res.json({ users: project?.users || [] })
  } catch (error) {
    next(error)
  }
}

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as any
    const projects = await findProjectsByUserId(user.id)
    const fullProjects = await Promise.all(
      projects.map((p) => getFullProject(p.id!))
    )
    res.json(fullProjects)
  } catch (error) {
    next(error)
  }
}
