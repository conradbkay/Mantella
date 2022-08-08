/* eslint-disable import/first */
import { Router } from 'express'
export const router = Router()

/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */
import './auth'
import './column'
import './list'
import './project'
import './task'
