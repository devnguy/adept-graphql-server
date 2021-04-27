const DateScalar = require('./DateScalar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { prisma } = require('./db')

// Using to store data until db is set up
const tempData = []

const resolvers = {
  Date: DateScalar,

  Query: {
    getUserById: async (_, args) => {
      return await prisma.user.findUnique({
        where: { userId: Number(args.id) },
      })
    },

    searchUsers: async (_, args) => {
      return await prisma.user.findMany({
        where: { name: args.name },
      })
    },
  },

  Mutation: {
    createUser: async (_, args) => {
      return await prisma.user.create({
        data: {
          name: args.input.name,
          email: args.input.email,
          type: args.input.type,
          password: args.input.password,
        },
      })
    },

    updateUserLocation: async (_, args) => {
      let userData = {}

      userData.user = await prisma.user.update({
        where: {
          userId: Number(args.input.userId),
        },
        data: {
          city: args.input.city,
          state: args.input.state,
        },
      })

      return userData
    },

    registerUser: async (_, { email, password }, ctx) => {
      const hash = await bcrypt.hash(password, 10)

      // const user = await ctx.prisma.createUser({email, password: hash})
      // Use this while waiting for prisma
      tempData.push({ id: tempData.length, email, password: hash })
      const user = tempData[tempData.length - 1]

      return user
    },

    loginUser: async (_, { email, password }, ctx) => {
      // const user = await ctx.prisma.user({ email })
      // Use this while waiting for prisma
      const [user] = tempData.filter((user) => user.email === email)

      // Todo: Ideally define reusable errors
      if (!user) throw new Error('That user does not exist')

      // Check if password matches
      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid password')
      }

      return {
        token: jwt.sign(
          {
            id: user.id,
            email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '12h',
          }
        ),
        user,
      }
    },
  },
}

module.exports = resolvers
