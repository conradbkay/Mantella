import { UserProps } from './../models/User'
import { ApolloServer } from 'apollo-server-express'

import fs from 'fs'
import path from 'path'
import { queries } from './queries/queries'
import { mutations } from './mutations/mutations'
import jsonwebtoken from 'jsonwebtoken'
import { UserModel } from '../models/User'
// Create a logger

const resolvers: any = {
  Query: queries,
  Mutation: mutations
}

const typeDefs: any = [
  fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
]

export const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: 'service:mantella:Ylb-gXcuSHCbWhBHn_Oa_A'
  },
  tracing: true,
  context: async ({ req, res }) => {
    try {
      const token: any = jsonwebtoken.decode(req.cookies['auth-token'])
      let user: UserProps | null | undefined

      if (token.id) {
        user = await UserModel.findOne({ _id: token.id })
      }

      return { req, res, user: user }
    } catch (err) {
      if (res) {
        res.clearCookie('auth-token')
      }

      return { req, res, user: null }
    }
  }
})
