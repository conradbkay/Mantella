import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { findProjectsByUserId, createProjectWithDefaults } from '../db/project'
import { createUser, deleteUser } from '../db/user'
import { validateRequest } from '../middleware/validate'
import { nanoid } from 'nanoid'

// Zod validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  persist: z.boolean()
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  persist: z.boolean()
})

export const validateRegister = validateRequest(registerSchema)
export const validateLogin = validateRequest(loginSchema)

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as any
    const projects = await findProjectsByUserId(user.id)
    const projectIds = projects.map((p) => p.id)

    res.json({
      user: {
        ...user,
        password: undefined,
        projectIds
      }
    })
  } catch (err) {
    next(err)
  }
}

// Helper function to create user with default project and handle login
async function createUserWithDefaultProject(
  userData: {
    username: string
    email: string
    password?: string
    profileImg: string
  },
  loginOptions: {
    persist: boolean
  },
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newUser = await createUser(userData)

    // Create default tutorial project but don't return it in response
    await createProjectWithDefaults(
      {
        name: 'Tutorial Project',
        ownerId: newUser.id!,
        colors: [],
        securityPublic: true
      },
      {
        id: newUser.id!,
        email: userData.email,
        username: userData.username,
        profileImg: userData.profileImg
      }
    )

    req.login(newUser, { session: loginOptions.persist }, async (err: any) => {
      if (err) {
        console.log('could not passport login during signup', err)
        return next(err)
      }

      // Get project IDs for the newly created user
      const projects = await findProjectsByUserId(newUser.id!)
      const projectIds = projects.map((p: any) => p.id)

      res.json({
        user: {
          ...newUser,
          password: undefined,
          projectIds
        }
      })
    })
  } catch (err) {
    next(err)
  }
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password, persist } = registerSchema.parse(
      req.body
    )

    await createUserWithDefaultProject(
      {
        username,
        email,
        password,
        profileImg:
          'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
      },
      { persist },
      req,
      res,
      next
    )
  } catch (err) {
    next(err)
  }
}

export const logout = async (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.log(err)
        res.status(400).send('unable to log out')
      }

      res.redirect('/')
    })
  } else {
    res.end()
  }
}

export const guestLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const guestEmail = `guest_${nanoid()}@example.com`

    await createUserWithDefaultProject(
      {
        username: 'Guest',
        email: guestEmail,
        profileImg:
          'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
      },
      { persist: true },
      req,
      res,
      next
    )
  } catch (err) {
    next(err)
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  await deleteUser((req.user as any).id)

  res.status(200)
}
