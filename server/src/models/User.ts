import bcrypt from 'bcryptjs'
import { prop, getModelForClass } from '@typegoose/typegoose'

class UserClass {
  @prop({ unique: true })
  email?: string
  @prop()
  password?: string
  @prop()
  username!: string
  @prop()
  profileImg?: string
  @prop()
  projects!: string[]
  @prop()
  id!: string
}

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email })
}

export const getUserById = async (id: string) => {
  return await UserModel.findOne({ id: id })
}

export const comparePassword = async (
  candidatePassword: string,
  hash: string
) => {
  return await bcrypt.compare(candidatePassword, hash)
}

export const UserModel = getModelForClass(UserClass)
