import { Kysely, SqliteDialect } from 'kysely'
import BetterSqlite3, { Database } from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

import { DB } from '../shared/types-gen'

interface DatabaseOptions {
  inMemory?: boolean
  path?: string
}

// Create database instance with options
export function createDatabase(options: DatabaseOptions = {}) {
  let sqlite3: Database

  if (options.inMemory) {
    // Create in-memory database for testing
    sqlite3 = new BetterSqlite3(':memory:')
  } else {
    // Use provided path or default path
    const dbPath =
      options.path ||
      (process.env.NODE_ENV === 'production'
        ? '/app/db/mantella.db'
        : path.resolve(__dirname, '../../db/mantella.db'))

    // Ensure data directory exists
    const dataDir = path.dirname(dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    sqlite3 = new BetterSqlite3(dbPath, {
      fileMustExist: false
    })

    // SQLite optimizations for web server (only for file-based databases)
    sqlite3.pragma('journal_mode = WAL')
    sqlite3.pragma('synchronous = NORMAL')
    sqlite3.pragma('cache_size = 1000')
    sqlite3.pragma('temp_store = MEMORY')
    sqlite3.pragma('mmap_size = 64000000') // 64MB
  }

  const dialect = new SqliteDialect({
    database: sqlite3
  })

  const db = new Kysely<DB>({ dialect })

  initializeDatabase(db)

  return {
    db,
    sqlite: sqlite3 as Database
  }
}

// Default database instance - automatically use in-memory for tests
const isTestEnvironment = process.env.NODE_ENV === 'test'
const { db: defaultDb, sqlite: defaultSqlite } = createDatabase({
  inMemory: isTestEnvironment
})
export const db = defaultDb
export const sqlite = defaultSqlite as Database

// Initialize database schema using Kysely
function initializeDatabase(db: Kysely<DB>) {
  // Users table
  db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('username', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text')
    .addColumn('profileImg', 'text')
    .addColumn('createdAt', 'datetime')
    .addColumn('updatedAt', 'datetime')
    .execute()

  // Projects table
  db.schema
    .createTable('projects')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('ownerId', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('colors', 'text') // JSON array of colors
    .addColumn('securityPublic', 'integer', (col) => col.defaultTo(0))
    .addColumn('createdAt', 'datetime')
    .addColumn('updatedAt', 'datetime')
    .execute()

  // Project users (many-to-many relationship)
  db.schema
    .createTable('projectUsers')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('projectId', 'text', (col) =>
      col.notNull().references('projects.id').onDelete('cascade')
    )
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('createdAt', 'datetime')
    .addUniqueConstraint('unique_project_user', ['projectId', 'userId'])
    .execute()

  // Lists table
  db.schema
    .createTable('lists')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('projectId', 'text', (col) =>
      col.notNull().references('projects.id').onDelete('cascade')
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('orderIndex', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('createdAt', 'datetime')
    .addColumn('updatedAt', 'datetime')
    .execute()

  // Tasks table
  db.schema
    .createTable('tasks')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('projectId', 'text', (col) =>
      col.notNull().references('projects.id').onDelete('cascade')
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('points', 'integer', (col) => col.defaultTo(0))
    .addColumn('color', 'text', (col) => col.notNull())
    .addColumn('workedOnMs', 'integer', (col) => col.defaultTo(0))
    .addColumn('createdAt', 'datetime')
    .addColumn('dueDate', 'datetime')
    .addColumn('timeEstimateValue', 'real')
    .addColumn('timeEstimateLowValue', 'real')
    .addColumn('timeEstimateLowPercentile', 'integer')
    .addColumn('timeEstimateHighValue', 'real')
    .addColumn('timeEstimateHighPercentile', 'integer')
    .addColumn('recurrenceInterval', 'integer')
    .addColumn('recurrenceNextDue', 'datetime')
    .addColumn('securityPublic', 'integer', (col) => col.defaultTo(1))
    .addColumn('securityAssignedUsers', 'text') // JSON array
    .addColumn('updatedAt', 'datetime')
    .execute()

  // Task assignments (many-to-many)
  db.schema
    .createTable('taskAssignments')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('taskId', 'text', (col) =>
      col.notNull().references('tasks.id').onDelete('cascade')
    )
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('createdAt', 'datetime')
    .addUniqueConstraint('unique_task_user', ['taskId', 'userId'])
    .execute()

  // Task list positions (tracks which list and position in list)
  db.schema
    .createTable('taskPositions')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('taskId', 'text', (col) =>
      col.notNull().references('tasks.id').onDelete('cascade')
    )
    .addColumn('listId', 'text', (col) =>
      col.notNull().references('lists.id').onDelete('cascade')
    )
    .addColumn('columnIndex', 'integer', (col) => col.notNull())
    .addColumn('positionIndex', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('updatedAt', 'datetime')
    .addUniqueConstraint('unique_task_position', ['taskId'])
    .execute()

  // Subtasks table
  db.schema
    .createTable('subtasks')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('taskId', 'text', (col) =>
      col.notNull().references('tasks.id').onDelete('cascade')
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('completed', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('orderIndex', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('createdAt', 'datetime')
    .addColumn('updatedAt', 'datetime')
    .execute()

  // Comments table
  db.schema
    .createTable('comments')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('taskId', 'text', (col) =>
      col.notNull().references('tasks.id').onDelete('cascade')
    )
    .addColumn('comment', 'text', (col) => col.notNull())
    .addColumn('dateAdded', 'datetime')
    .addColumn('lastEdited', 'datetime')
    .addColumn('createdAt', 'datetime')
    .execute()

  // History table for audit trail
  db.schema
    .createTable('history')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('projectId', 'text', (col) =>
      col.notNull().references('projects.id').onDelete('cascade')
    )
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('entityType', 'text', (col) => col.notNull()) // 'task', 'project', 'user', etc.
    .addColumn('entityId', 'text')
    .addColumn('userId', 'text')
    .addColumn('changes', 'text') // JSON of what changed
    .addColumn('timestamp', 'datetime')
    .execute()

  // Create indexes for better performance
  Promise.all([
    db.schema
      .createIndex('idx_users_email')
      .ifNotExists()
      .on('users')
      .column('email')
      .execute(),
    db.schema
      .createIndex('idx_projects_owner')
      .ifNotExists()
      .on('projects')
      .column('ownerId')
      .execute(),
    db.schema
      .createIndex('idx_project_users_project')
      .ifNotExists()
      .on('projectUsers')
      .column('projectId')
      .execute(),
    db.schema
      .createIndex('idx_project_users_user')
      .ifNotExists()
      .on('projectUsers')
      .column('userId')
      .execute(),
    db.schema
      .createIndex('idx_lists_project')
      .ifNotExists()
      .on('lists')
      .column('projectId')
      .execute(),
    db.schema
      .createIndex('idx_tasks_project')
      .ifNotExists()
      .on('tasks')
      .column('projectId')
      .execute(),
    db.schema
      .createIndex('idx_tasks_due_date')
      .ifNotExists()
      .on('tasks')
      .column('dueDate')
      .execute(),
    db.schema
      .createIndex('idx_task_assignments_task')
      .ifNotExists()
      .on('taskAssignments')
      .column('taskId')
      .execute(),
    db.schema
      .createIndex('idx_task_assignments_user')
      .ifNotExists()
      .on('taskAssignments')
      .column('userId')
      .execute(),
    db.schema
      .createIndex('idx_task_positions_list')
      .ifNotExists()
      .on('taskPositions')
      .column('listId')
      .execute(),
    db.schema
      .createIndex('idx_task_positions_task')
      .ifNotExists()
      .on('taskPositions')
      .column('taskId')
      .execute(),
    db.schema
      .createIndex('idx_comments_task')
      .ifNotExists()
      .on('comments')
      .column('taskId')
      .execute(),
    db.schema
      .createIndex('idx_subtasks_task')
      .ifNotExists()
      .on('subtasks')
      .column('taskId')
      .execute(),
    db.schema
      .createIndex('idx_history_project')
      .ifNotExists()
      .on('history')
      .column('projectId')
      .execute(),
    db.schema
      .createIndex('idx_history_timestamp')
      .ifNotExists()
      .on('history')
      .column('timestamp')
      .execute()
  ])
}

// Graceful shutdown
export function closeDatabase() {
  sqlite.close()
}
