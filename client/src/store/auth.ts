import { TAuthUser } from '../types/state'

export const transformUser = (user: any): TAuthUser => ({
  username: user.username,
  profileImg: user.profileImg || '',
  joinedIds: user.projects.map((proj: any) =>
    typeof proj === 'string' ? proj : (proj.id as string)
  ),
  id: user.id as string,
  email: user.email,
  guest: user.guest
})
