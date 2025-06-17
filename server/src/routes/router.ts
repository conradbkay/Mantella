/* eslint-disable import/first */
import { Router } from 'express'
import {
  logout,
  register,
  login,
  guestLogin,
  validateRegister,
  validateLogin
} from './auth'
import { isAuthenticated } from '../passport'
import passport from 'passport'

// Import project route handlers and validators
import {
  createProject,
  editProject,
  deleteProject,
  leaveProject,
  kickUserFromProject,
  getProjectById,
  shareProject,
  getProjectMembers,
  validateCreateProject,
  validateEditProject,
  validateDeleteProject,
  validateLeaveProject,
  validateRemoveMember,
  validateShareProject,
  validateGetProjectById,
  validateGetProjectMembers,
  getProjects
} from './project'

// Import list route handlers
import {
  editList,
  createList,
  deleteList,
  setListIdx,
  validateEditList,
  validateCreateList,
  validateDeleteList,
  validateSetListIdx
} from './list'

// Import task route handlers
import {
  createTask,
  editTask,
  deleteTask,
  dragTask,
  setSubtask,
  setComment,
  assignUserToTask,
  validateCreateTask,
  validateEditTask,
  validateDeleteTask,
  validateDragTask,
  validateSetSubtask,
  validateSetComment,
  validateAssignUserToTask
} from './task'

// Import user route handlers
import { setEmail, setName, setPassword, deleteAccount } from './user'

export const router = Router()

/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */

router.post('/logout', logout)
router.post('/register', validateRegister, register)
router.post(
  '/login',
  validateLogin,
  passport.authenticate('local', { session: true }),
  login
)
router.post('/cookieLogin', isAuthenticated, login)
router.post('/guestLogin', guestLogin)

// Project routes
router.post('/projects', isAuthenticated, getProjects)
router.post(
  '/createProject',
  isAuthenticated,
  validateCreateProject,
  createProject
)
router.post('/editProject', isAuthenticated, validateEditProject, editProject)
router.post(
  '/deleteProject',
  isAuthenticated,
  validateDeleteProject,
  deleteProject
)
router.post(
  '/leaveProject',
  isAuthenticated,
  validateLeaveProject,
  leaveProject
)
router.post(
  '/kickUserFromProject',
  isAuthenticated,
  validateRemoveMember,
  kickUserFromProject
)
router.post(
  '/getProjectById',
  isAuthenticated,
  validateGetProjectById,
  getProjectById
)
router.post(
  '/shareProject',
  isAuthenticated,
  validateShareProject,
  shareProject
)
router.post(
  '/getProjectMembers',
  isAuthenticated,
  validateGetProjectMembers,
  getProjectMembers
)

// List routes
router.post('/editList', isAuthenticated, validateEditList, editList)
router.post('/createList', isAuthenticated, validateCreateList, createList)
router.post('/deleteList', isAuthenticated, validateDeleteList, deleteList)
router.post('/setListIdx', isAuthenticated, validateSetListIdx, setListIdx)

// Task routes
router.post('/createTask', isAuthenticated, validateCreateTask, createTask)
router.post('/editTask', isAuthenticated, validateEditTask, editTask)
router.post('/deleteTask', isAuthenticated, validateDeleteTask, deleteTask)
router.post('/dragTask', isAuthenticated, validateDragTask, dragTask)
router.post('/setSubtask', isAuthenticated, validateSetSubtask, setSubtask)
router.post('/setComment', isAuthenticated, validateSetComment, setComment)
router.post(
  '/assignUserToTask',
  isAuthenticated,
  validateAssignUserToTask,
  assignUserToTask
)

router.post('/setEmail', isAuthenticated, setEmail)
router.post('/setName', isAuthenticated, setName)
router.post('/setPassword', isAuthenticated, setPassword)
router.post('/deleteAccount', isAuthenticated, deleteAccount)
