import { db } from './db'
import { type DB } from '../shared/types-gen'
import { type Selectable, type Insertable, type Updateable } from 'kysely'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

export interface CreateUserInput {
  username: string
  email: string
  password?: string
  profileImg?: string
}

// Use Kysely's generated types
export type User = Selectable<DB['users']>
export type NewUser = Insertable<DB['users']>
export type UserUpdate = Updateable<DB['users']>

// Create a new user
export async function createUser(userData: CreateUserInput): Promise<User> {
  const id = nanoid()
  const now = new Date().toISOString()
  const hashedPassword = userData.password
    ? await bcrypt.hash(userData.password, 10)
    : null

  const user = await db
    .insertInto('users')
    .values({
      id,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profileImg: userData.profileImg,
      createdAt: now,
      updatedAt: now
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return user
}

// Find user by email
export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst()
}

// Find user by ID
export async function findUserById(id: string): Promise<User | undefined> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

// Update user
export async function updateUser(
  id: string,
  updates: Partial<
    Pick<UserUpdate, 'username' | 'email' | 'password' | 'profileImg'>
  >
): Promise<User> {
  const user = await db
    .updateTable('users')
    .set({
      ...updates,
      updatedAt: new Date().toISOString()
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()

  return user
}

// Delete user
export async function deleteUser(id: string): Promise<void> {
  await db.deleteFrom('users').where('id', '=', id).execute()
}

// Compare password
export async function comparePassword(
  candidatePassword: string,
  hash: string
): Promise<boolean> {
  if (!hash || !candidatePassword) {
    return false
  }

  return await bcrypt.compare(candidatePassword, hash)
}

// Get user's projects
export async function getUserProjects(userId: string) {
  return await db
    .selectFrom('projects')
    .innerJoin('projectUsers', 'projects.id', 'projectUsers.projectId')
    .selectAll('projects')
    .where('projectUsers.userId', '=', userId)
    .execute()
}
