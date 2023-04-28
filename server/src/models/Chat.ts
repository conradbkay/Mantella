import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: 0 } })
export class Chat {
  @prop()
  public messages!: Array<{
    senderId: string
    message: string
    createdAt: number
    id: string
    replyToId?: string
  }>
  @prop()
  public name!: string
  @prop()
  public id!: string
  @prop()
  public projectId!: string
}
export const ChatModel = getModelForClass(Chat)
