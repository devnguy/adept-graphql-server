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
          resume: true,
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

    getSkillById: async (_, { skillId }) => {
      const skill = await prisma.skill.findUnique({
        where: { skillId: skillId },
      })

      if (!skill) throw new Error('That skill does not exist')

      return skill
    },

    getAllSkills: async () => {
      return await prisma.skill.findMany()
    },

    searchSkills: async (_, { name }) => {
      return await prisma.skill.findMany({
        where: { name: name },
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
      // Finding if user exists
      if (
        !(await prisma.user.findUnique({
          where: { userId: args.input.userId },
        }))
      )
        throw new Error('That user does not exist')

      return await prisma.user.update({
        where: {
          userId: args.input.userId,
        },

        data: {
          city: args.input.city,
          state: args.input.state,
        },
      })
    },

    deleteUser: async (_, { userId }) => {
      // TODO: Deleting a user deletes associated job apps/posts

      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },
      })

      if (!findUser) throw new Error('That user does not exist')

      const deleteJobApp = await prisma.jobApplication.deleteMany({
        where: { userId: userId },
      })

      const deleteJobPost = await prisma.jobPosting.deleteMany({
        where: { userId: userId },
      })

      return await prisma.user.delete({
        where: { userId: userId },
      })
    },

    addSkillToUser: async (_, { userId, skillId }) => {
      return await prisma.user.update({
        where: { userId: userId },

        data: {
          skills: {
            connect: { skillId: skillId },
          },
        },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })
    },

    deleteSkillFromUser: async (_, { userId, skillId }) => {
      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },
      })

      if (!findUser) throw new Error('That user does not exist')

      return await prisma.user.update({
        where: { userId: userId },

        data: {
          skills: {
            disconnect: [{ skillId: skillId }],
          },
        },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })
    },

    addContactToUser: async (_, { userId, contactId }) => {
      return await prisma.user.update({
        where: { userId: userId },

        data: {
          contacts: {
            connect: [{ userId: contactId }],
          },
        },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })
    },

    removeContactFromUser: async (_, { userId, contactId }) => {
      return await prisma.user.update({
        where: { userId: userId },

        data: {
          contacts: {
            disconnect: [{ userId: contactId }],
          },
        },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
        },
      })
    },

    /**
     * Working on this
     */
    // addSchoolToResume: async (_, { input }) => {
    //   let resume

    //   const school = await prisma.school.create({
    //     data: {
    //       name: input.name,
    //       degree: input.degree,
    //       startDate: input.startDate,
    //       endDate: input.endDate,
    //       major: input.major,
    //       gpa: input.gpa,
    //     },
    //   })

    //   const user = await prisma.user.findUnique({
    //     where: { userId: input.userId },
    //   })

    //   if (!user.resume) {
    //     resume = await prisma.resume.create({
    //       data: {
    //         schoolId: school.schoolId,
    //       },

    //       include: {
    //         education: true,
    //         workExperience: true,
    //       },
    //     })
    //   } else {
    //     resume = await prisma.resume.update({
    //       where: { userId: input.userId },

    //       data: {
    //         school: {
    //           connect: [{ schoolId: school.schoolId }],
    //         },
    //       },
    //     })
    //   }

    //   // const updatedResume = await prisma.resume.update({
    //   //   where: { resumeId: resume.resumeId },

    //   //   data: {
    //   //     school: {
    //   //       connect: [{ schoolId: school.schoolId }],
    //   //     },
    //   //   },
    //   // })

    //   return await prisma.user.findUnique({
    //     where: { userId: input.userId },

    //     include: {
    //       skills: true,
    //       jobApplications: true,
    //       jobPostings: true,
    //       contacts: true,
    //     },
    //   })
    // },

    createJobApplication: async (_, args) => {
      return await prisma.jobApplication.create({
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
    },

    deleteJobApplication: async (_, { jobAppId }) => {
      // Finding out if job application exists
      const findJobApp = await prisma.jobApplication.findUnique({
        where: { jobAppId: jobAppId },
      })

      if (!findJobApp) throw new Error('That job application does not exist')

      return await prisma.jobApplication.delete({
        where: { jobAppId: jobAppId },
      })
    },

    createJobPosting: async (_, args) => {
      // Need to create list of skill objects to connect skills to job posting
      const skillIds = args.input.skillsRequired.map((skillId) => ({
        skillId,
      }))

      return await prisma.jobPosting.create({
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
    },

    deleteJobPosting: async (_, { jobPostId }) => {
      const findJobPost = await prisma.jobPosting.findUnique({
        where: { jobPostId: jobPostId },
      })

      if (!findJobPost) throw new Error('That job posting does not exist')

      // Delete associated job applications
      const deleteJobApps = await prisma.jobApplication.deleteMany({
        where: { jobPostId: jobPostId },
      })

      return await prisma.jobPosting.delete({
        where: { jobPostId: jobPostId },
      })
    },

    createSkill: async (_, args) => {
      return await prisma.skill.create({
        data: {
          name: args.name,
        },
      })
    },

    deleteSchool: async (_, { schoolId }) => {
      const findSchool = await prisma.school.findUnique({
        where: { schoolId: schoolId },
      })

      if (!findSchool) throw new Error('That school does not exist')

      return await prisma.school.delete({
        where: { schoolId: schoolId },
      })
    },

    deleteWorkExperience: async (_, { workExpId }) => {
      const findWorkExp = await prisma.workExperience.findUnique({
        where: { workExpId: workExpId },
      })

      if (!findWorkExp) throw new Error('That work experience does not exist')

      return await prisma.workExperience.delete({
        where: { workExpId: workExpId },
      })
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

    // contacts: async (parent) => {
    //   return await prisma.user.findMany({
    //     where: { contacts: parent.userId },
    //   })
    // },

    // resume: async (parent) => {
    //   return await prisma.resume.findMany({
    //     where: { userId: parent.userId },
    //   })
    // },
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
    // skillsRequired: async (parent) => {
    //   // Finding skills for job posting
    //   return await prisma.skill.findMany({
    //     where: { skillId: parent.skillId },
    //   })
    // },

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
