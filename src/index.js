const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema/schema')
const resolvers = require('./schema/resolvers')

require('dotenv').config()

const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
    ✉️   Localhost: http://localhost:4000/
  `)
})
