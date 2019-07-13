module.exports = {
  service: {
    localSchemaFile: './server/src/graphql/schema.graphql'
  },
  client: {
    includes: ['client/src/**/*.{ts,tsx,gql,graphql,js}'],
    excludes: ['**/node_modules/**/*'],
    tagName: 'gql',
    service: {
      name: 'mantella',
      localSchemaFile: './server/src/graphql/schema.graphql'
    }
  },
  engine: {
    apiKey: 'service:mantella:Ylb-gXcuSHCbWhBHn_Oa_A'
  }
}
