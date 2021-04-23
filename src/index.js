const { ApolloServer, MockList } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const mocks = {
  Query: () => ({
    getAllSkills: () => new MockList([2, 6]),
  }),
  Skill: () => ({
    id: () => 'skill_1',
    name: () => 'React',
  }),
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
  `)
})
