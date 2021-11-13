import { Router } from 'express'
import { getUserHandler } from './auth'

export const router = Router()

router.get('/user', getUserHandler)
