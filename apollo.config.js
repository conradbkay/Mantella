module.exports = {
  service: {
    endpoint: {
      url: 'http://localhost:4000/graphql'
    },
    includes: ['./server/src/graphql/**/*.{graphql,gql,ts}'],
    localSchemaFile: './server/src/graphql/schema.graphql'
  },
  client: {
    service: 'mantella',
    tagName: 'gql',
    url: 'http://localhost:4000/graphql'
  },
  engine: {
    apiKey: 'service:mantella:Ylb-gXcuSHCbWhBHn_Oa_A'
  }
}
