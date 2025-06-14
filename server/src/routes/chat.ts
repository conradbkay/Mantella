import { ProjectModel } from '../models/Project'
import { nanoid } from 'nanoid'
import { router } from './router'
import { isAuthenticated } from '../passport'
import { Request, Response } from 'express'
import { ChatModel } from '../models/Chat'

export const getChat = async (req: Request, res: Response) => {
  const chat = await ChatModel.findOne({ id: req.body.id })

  res.json({ chat })
}

router.post('/chat', isAuthenticated, getChat)

export const sendMessage = async (req: Request, res: Response) => {
  const messageId = nanoid()

  const chat = await ChatModel.findOne({ id: req.body.chatId })

  if (chat) {
    chat.messages.unshift({
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

export const createChannel = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    const name = req.body.name || 'New Channel'

    const chatId = nanoid()

    await ChatModel.create({
      id: chatId,
      projectId: req.body.projId,
      name,
      messages: []
    })

    proj.channels.push([chatId, name])
    await proj.save()

    res.json({ project: proj })
  } else {
    throw new Error('Project does not exist')
  }
}

router.post('/createChannel', isAuthenticated, createChannel)

export const deleteChannel = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    proj.channels = proj.channels.filter(
      (channel) => channel[0] !== req.body.id
    )
    await proj.save()

    res.json({ project: proj })
  } else {
    throw new Error('Project does not exist')
  }
}

router.post('/deleteChannel', isAuthenticated, deleteChannel)

export const editChannel = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    const channelIdx = proj.channels.findIndex(
      (channel) => channel[0] === req.body.id
    )

    if (channelIdx >= 0) {
      proj.channels[channelIdx][1] = req.body.name
      proj.markModified('channels')
      await proj.save()

      res.json(proj)
    } else {
      throw new Error('Channel does not exist')
    }
  } else {
    throw new Error('Project does not exist')
  }
}

router.post('/editChannel', isAuthenticated, editChannel)

export const createChat = async (projectId: string) => {
  const chatId = nanoid()
  await ChatModel.create({
    id: chatId,
    messages: [],
    projectId: projectId
  })
  return [chatId, 'General']
}
