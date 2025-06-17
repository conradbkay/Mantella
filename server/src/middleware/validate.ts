import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body)
    if (error) {
      res.status(400).json({ error: error.message })
      return
    }
    next()
  }
}
