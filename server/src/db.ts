import * as mongoose from 'mongoose'

export async function connect(dbConnect: string) {
  await mongoose.connect(dbConnect)
}

export async function disconnect() {}
