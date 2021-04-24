const DateScalar = require('./DateScalar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Using to store data until db is set up
const tempData = []

const resolvers = {
  Date: DateScalar,

  Mutation: {
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
            data: {
              id: user.id,
              email,
            },
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
