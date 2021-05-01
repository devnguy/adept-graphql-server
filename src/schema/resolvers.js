const DateScalar = require('./DateScalar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { prisma } = require('../lib/db')

const resolvers = {
  Date: DateScalar,

  Query: {
    getUserById: async (_, args) => {
      const user = await prisma.user.findUnique({
        where: { userId: args.id },
      })

      if (!user) throw new Error('That user does not exist')

      return user
    },

    searchUsers: async (_, args) => {
      return await prisma.user.findMany({
        where: { name: args.name },
      })
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      const hash = await bcrypt.hash(input.password, 10)
      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          type: input.type,
          password: hash,
          resume: {
            create: {},
          },
        },
      })
    },

    updateUserLocation: async (_, args) => {
      let userData = {}

      // Finding if user exists
      if (
        !(await prisma.user.findUnique({
          where: { userId: args.input.userId },
        }))
      )
        throw new Error('That user does not exist')

      userData.user = await prisma.user.update({
        where: {
          userId: args.input.userId,
        },
        data: {
          city: args.input.city,
          state: args.input.state,
        },
      })

      return userData
    },

    createJobPosting: async (_, args) => {
      let jobPostingData = {}

      // Need to create list of skill objects to connect skills to job posting
      const skillIds = args.input.skillsRequired.map((skill) => ({
        skillId: skill,
      }))

      jobPostingData.jobPosting = await prisma.jobPosting.create({
        data: {
          positionTitle: args.input.positionTitle,
          company: args.input.company,
          datePosted: args.input.datePosted,
          city: args.input.city,
          state: args.input.state,
          salary: args.input.salary,
          type: args.input.type,
          description: args.input.description,
          skillsRequired: {
            connect: skillIds,
          },
          postedBy: {
            connect: { userId: args.input.postedBy },
          },
        },

        include: {
          skillsRequired: true,
          postedBy: true,
        },
      })

      return jobPostingData
    },

    createSkill: async (_, args) => {
      let skillData = {}

      skillData.skill = await prisma.skill.create({
        data: {
          name: args.input.name,
        },
      })

      return skillData
    },

    loginUser: async (_, { email, password }, ctx) => {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      // Todo: Ideally define reusable errors
      if (!user) throw new Error('That user does not exist')

      // Check if password matches
      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid password')
      }
      const payload = { id: user.userId, type: user.type }

      return {
        token: jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '12h',
        }),
        user,
      }
    },
  },

  JobPosting: {
    skillsRequired: async (parent) => {
      // Finding skills for job posting
      return await prisma.skill.findMany({
        where: { skillId: parent.skillId },
      })
    },

    postedBy: async (parent) => {
      // Finding user who created job post
      return await prisma.user.findUnique({
        where: { userId: parent.userId },
      })
    },
  },
}

module.exports = resolvers
