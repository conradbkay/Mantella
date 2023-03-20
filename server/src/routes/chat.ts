import { ProjectModel } from '../models/Project'
import { v4 as uuid } from 'uuid'
import { router } from './router'
import { isAuthenticated } from '../passport'
import { Request, Response } from 'express'
import { ChatModel } from '../models/Chat'

export const createChat = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    const chatId = uuid()
    const chat = await ChatModel.create({
      id: chatId,
      projectId: req.body.projId,
      messages: []
    })
    proj.chatId = chatId
    await proj.save()

    res.json({ chat: chat.toObject() })
  } else {
    throw new Error('Project does not exist')
  }
}

router.post('/createChat', isAuthenticated, createChat)

export const sendMessage = async (req: Request, res: Response) => {
  const messageId = uuid()

  const chat = await ChatModel.findOne({ id: req.body.chatId })

  if (chat) {
    chat.messages.push({
      id: messageId,
      senderId: (req.user as any).id,
      message: req.body.message,
      createdAt: Date.now(),
      replyToId: req.body.replyToId
    })
    await chat.save()

    res.json({ message: chat.messages[chat.messages.length - 1] })
  } else {
    throw new Error('Chat does not exist')
  }
}

router.post('/sendMessage', isAuthenticated, sendMessage)
