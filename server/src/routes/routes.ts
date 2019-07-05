import { UserProps } from './../models/User'
import express, { Response, Request, NextFunction } from 'express'
import { UserModel } from '../models/User'
import { purifyProjects } from '../utils'

const router = express.Router()

const USER_ROUTE_PATH = '/user'

interface UserRouteReq extends Request {
  body: {
    id: string
  }
}

export const getUser = async (req: UserRouteReq, res: Response) => {
  const user = await UserModel.findById(req.body.id)

  const userWithProjects = await user!.populate('projects').execPopulate()

  const newProjects = await purifyProjects(userWithProjects.projects)

  const returning = {
    ...(user!.toObject() as UserProps),
    projects: newProjects
  }

  return returning
}

const getUserHandler = async (
  req: UserRouteReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getUser(req, res)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

router.get(USER_ROUTE_PATH, getUserHandler)

export default router
