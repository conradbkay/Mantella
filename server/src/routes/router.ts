/* eslint-disable import/first */
import { Router } from 'express'
import { logout, register, login, guestLogin } from './auth'
import { isAuthenticated } from '../passport'
import passport from 'passport'

export const router = Router()

/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */

router.post('/logout', logout)
router.post('/register', register)
// doesn't work without {session: true}
router.post('/login', passport.authenticate('local', { session: true }), login)
router.post('/cookieLogin', isAuthenticated, login)
router.post('/guestLogin', guestLogin)

import './list'
import './project'
import './chat'
import './task'
import './user'
