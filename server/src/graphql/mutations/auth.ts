import { UserProps } from './../../models/User'
import bcrypt from 'bcryptjs'
import { MutationResolvers } from '../../graphql/types'
import { UserModel, comparePassword } from '../../models/User'
import { ProjectModel } from '../../models/Project'
import { Types } from 'mongoose'
import { taskObjects, projectData } from '../../data'
import jsonwebtoken from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-core'
import { purifyProjects } from '../../utils'
import { ObjectId } from 'bson'

const loginWithCookie: MutationResolvers['loginWithCookie'] = async (
  parent,
  obj,
  context
) => {
  if (!context.user) {
    throw new AuthenticationError('no token man')
  }

  const user: UserProps | null = await context.user
    .populate('projects')
    .execPopulate()

  if (!user) {
    throw new AuthenticationError('Token Corrupt!')
  }

  return {
    user: {
      ...(user as any).toObject(),
      projects: await purifyProjects(user.projects)
    }
  }
}

const login: MutationResolvers['login'] = async (parent, obj, context) => {
  const user = await UserModel.findOne({ email: obj.email }).populate(
    'projects'
  )

  if (user) {
    const newUser = {
      ...user.toObject(),
      projects: await purifyProjects(user.projects)
    }
    const passwordMatch = await comparePassword(obj.password, newUser.password)

    if (passwordMatch) {
      const token = jsonwebtoken.sign(
        { id: newUser._id },
        process.env.PRIVATE!,
        { expiresIn: '1d' }
      )

      context.res.cookie('auth-token', token, { httpOnly: true })

      return { user: newUser }
    }
    throw new AuthenticationError('Incorrect Password')
  }
  throw new AuthenticationError('User with Email does not exist!')
}

const register: MutationResolvers['register'] = async (
  parent,
  obj,
  context
) => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(obj.password, salt)

  const projectId = Types.ObjectId()
  const userId = Types.ObjectId()

  const ids: ObjectId[] = []

  for (let i = 0; i < 16; i += 1) {
    ids.push(Types.ObjectId())
  }

  await ProjectModel.create(
    projectData(ids, taskObjects(ids), userId, projectId, [
      Types.ObjectId(),
      Types.ObjectId(),
      Types.ObjectId()
    ])
  )

  const newUser = await UserModel.create({
    password,
    _id: userId,
    email: obj.email,
    username: obj.username,
    projects: [projectId],
    profileImg:
      'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
  })

  const userWithProjects = await newUser.populate('projects').execPopulate()

  if (context.res) {
    const token = jsonwebtoken.sign({ id: newUser._id }, process.env.PRIVATE!, {
      expiresIn: '1d'
    })

    context.res.cookie('auth-token', token, { httpOnly: true })
  }

  const newProjects = await purifyProjects(userWithProjects.projects)

  const returning = {
    user: {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      projects: newProjects
    }
  }

  return returning
}

const logout: MutationResolvers['logout'] = async (parent, obj, context) => {
  context.res.clearCookie('auth-token')

  return null
}

export const authMutations = { login, register, logout, loginWithCookie }
