import { TProfile } from '../types/state'

export const transformUser = (user: any): TProfile => ({
  username: user.username,
  profileImg: user.profileImg || '',
  id: user.id as string,
  email: user.email
})

// This file can be used for auth-related transformations if needed in the future
