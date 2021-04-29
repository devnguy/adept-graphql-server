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
      const user = await prisma.user.findUnique({
        where: { userId: args.userId },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })

      if (!user) throw new Error('That user does not exist')

      return user
    },

    searchUsers: async (_, args) => {
      return await prisma.user.findMany({
        where: { name: args.name },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })
    },

    getJobApplicationById: async (_, args) => {
      const jobApplication = await prisma.jobApplication.findUnique({
        where: { jobAppId: args.jobAppId },
      })

      if (!jobApplication)
        throw new Error('That job application does not exist')

      return jobApplication
    },

    getAllJobApplications: async () => {
      return await prisma.jobApplication.findMany()
    },

    /**
     * Commenting these out because I don't think we actually need them
     * since we have the JobApplication array in both User and JobPosting
     */
    //   getAllJobApplicationsByUser: async (_, args) => {
    //     const jobApplications = await prisma.jobApplication.findMany({
    //       where: { userId: args.userId },
    //     })

    //     return jobApplications
    //   },

    //   getAllJobApplicationsForJobPosting: async (_, args) => {
    //     const jobApplications = await prisma.jobApplication.findMany({
    //       where: { jobPostId: args.jobPostId },
    //     })

    //     return jobApplications
    //   },

    getJobPostingById: async (_, args) => {
      const jobPosting = await prisma.jobPosting.findUnique({
        where: { jobPostId: args.jobPostId },

        include: {
          skillsRequired: true,
          applicants: true,
        },
      })

      if (!jobPosting) throw new Error('That job posting does not exist')

      return jobPosting
    },

    getAllJobPostings: async () => {
      return await prisma.jobPosting.findMany({
        include: {
          skillsRequired: true,
          applicants: true,
        },
      })
    },

    // TODO: searchJobPostings
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

    createJobApplication: async (_, args) => {
      let jobApplicationData = {}

      jobApplicationData.jobApplication = await prisma.jobApplication.create({
        data: {
          user: {
            connect: { userId: args.input.userId },
          },
          jobPosting: {
            connect: { jobPostId: args.input.jobPostId },
          },
          dateApplied: args.input.dateApplied,
        },

        include: {
          user: true,
          jobPosting: true,
        },
      })

      return jobApplicationData
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

  User: {
    jobApplications: async (parent) => {
      return await prisma.jobApplication.findMany({
        where: { userId: parent.userId },
      })
    },

    jobPostings: async (parent) => {
      return await prisma.jobPosting.findMany({
        where: { userId: parent.userId },
      })
    },

    resume: async (parent) => {
      return await prisma.resume.findMany({
        where: { userId: parent.userId },
      })
    },
  },

  JobApplication: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { userId: parent.userId },
      })
    },

    jobPosting: async (parent) => {
      return await prisma.jobPosting.findUnique({
        where: { jobPostId: parent.jobPostId },
      })
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

  Resume: {
    education: async (parent) => {
      return await prisma.school.findMany({
        where: { resumeId: parent.resumeId },
      })
    },

    workExperience: async (parent) => {
      return await prisma.workExperience.findMany({
        where: { resumeId: parent.resumeId },
      })
    },
  },
}

module.exports = resolvers
