import bcrypt from 'bcryptjs'
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { Project } from './Project'
@modelOptions({ options: { allowMixed: 0 } })
export class User {
  @prop()
  public password?: string
  @prop()
  public username!: string
  @prop()
  public profileImg?: string
  @prop()
  public projects!: string[]
  @prop()
  public guest?: boolean
  @prop()
  public id!: string
  @prop({ unique: true })
  public email!: string
}

export type UserWithProjects = Omit<User, 'projects'> & {
  projects: Project[]
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

export const UserModel = getModelForClass(User)
