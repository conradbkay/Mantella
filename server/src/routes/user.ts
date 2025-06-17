import { Request, Response } from 'express'
import { findUserByEmail, updateUser, deleteUser } from '../db/user'
import bcrypt from 'bcryptjs'

export const setEmail = async (req: Request, res: Response) => {
  const user = req.user as any

  const withEmail = await findUserByEmail(req.body.email)

  if (withEmail) {
    res.status(400).json({ error: 'Email already in use' })
    return
  }

  await updateUser(user.id, { email: req.body.email })

  res.json({ email: req.body.email })
}

export const setName = async (req: Request, res: Response) => {
  const user = req.user as any

  await updateUser(user.id, { username: req.body.username })

  res.json({ name: req.body.username })
}

const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4

export const setPassword = async (req: Request, res: Response) => {
  const user = req.user as any
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_LENGTH)

  await updateUser(user.id, { password: hashedPassword })

  res.json({ message: 'Password updated' })
}

export const deleteAccount = async (req: Request, res: Response) => {
  const user = req.user as any

  try {
    // Delete the user from the database
    await deleteUser(user.id)

    // Log the user out by destroying the session
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err)
        return res
          .status(500)
          .json({ error: 'Failed to log out after account deletion' })
      }

      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err)
          return res.status(500).json({ error: 'Failed to destroy session' })
        }

        // Clear the session cookie
        res.clearCookie('Mantella')
        res.json({ message: 'Account deleted successfully' })
      })
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}
