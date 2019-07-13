module.exports = {
  service: {
    localSchemaFile: './server/src/graphql/schema.graphql'
  },
  client: {
    localSchemaFile: './server/src/graphql/schema.graphql',
    service: 'mantella',
    tagName: 'gql',
    url: 'http://localhost:4000/graphql'
  },
  engine: {
    apiKey: 'service:mantella:Ylb-gXcuSHCbWhBHn_Oa_A'
  }
}
