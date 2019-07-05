module.exports = {
  service: {
    name: 'gql-server',
    endpoint: {
      url: 'http://localhost:4000/graphql'
    },
    includes: ['./server/src/graphql/**/*.{graphql,gql,ts}'],
    localSchemaFile: './server/src/graphql/schema.graphql'
  },
  client: {
    name: 'gql-client',
    service: 'mantella',
    tagName: 'gql',
    includes: ['./client/src/**/*.{ts,tsx,graphql,gql}'],
  },
  engine: {
    apiKey: 'service:mantella:Ylb-gXcuSHCbWhBHn_Oa_A'
  }
}
