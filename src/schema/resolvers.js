const DateScalar = require('./DateScalar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { prisma } = require('../lib/db')

const resolvers = {
  Date: DateScalar,

  Query: {
    getUserById: async (_, { userId }) => {
      return await prisma.user.findUnique({
        where: { userId: userId },

        // Include the relationship data
        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
          resume: true,
        },
      })
    },

    searchUsers: async (_, { name }) => {
      return await prisma.user.findMany({
        where: {
          name: {
            contains: name,
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

    getJobApplicationById: async (_, { jobAppId }) => {
      return await prisma.jobApplication.findUnique({
        where: { jobAppId: jobAppId },
      })
    },

    getAllJobApplications: async () => {
      return await prisma.jobApplication.findMany()
    },

    getJobPostingById: async (_, { jobPostId }) => {
      return await prisma.jobPosting.findUnique({
        where: { jobPostId: jobPostId },

        include: {
          skillsRequired: true,
          postedBy: true,
          applicants: true,
        },
      })
    },

    getAllJobPostings: async () => {
      return await prisma.jobPosting.findMany({
        include: {
          skillsRequired: true,
          applicants: true,
        },
      })
    },

    searchJobPostings: async (_, { positionTitle, company, city, state }) => {
      return await prisma.jobPosting.findMany({
        where: {
          // Finding any job postings containing the input from user
          // for positionTitle, company, city, or state
          OR: [
            {
              positionTitle: {
                contains: positionTitle,
              },
            },
            {
              AND: {
                company: {
                  contains: company,
                },
              },
            },
            {
              AND: {
                city: {
                  contains: city,
                },
              },
            },
            {
              AND: {
                state: {
                  contains: state,
                },
              },
            },
          ],
        },

        include: {
          skillsRequired: true,
          applicants: true,
        },
      })
    },

    getSkillById: async (_, { skillId }) => {
      return await prisma.skill.findUnique({
        where: { skillId: skillId },
      })
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

    updateUserLocation: async (_, { input }) => {
      // Finding if user exists
      if (
        !(await prisma.user.findUnique({
          where: { userId: input.userId },
        }))
      )
        throw new Error('That user does not exist')

      return await prisma.user.update({
        where: {
          userId: input.userId,
        },

        data: {
          city: input.city,
          state: input.state,
        },
      })
    },

    deleteUser: async (_, { userId }) => {
      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },

        include: {
          resume: true,
        },
      })

      if (!findUser) throw new Error('That user does not exist')

      // Deleting job applications associated with the user
      const deleteJobApp = await prisma.jobApplication.deleteMany({
        where: { userId: userId },
      })

      // Deleting job postings associated with the user
      const deleteJobPost = await prisma.jobPosting.deleteMany({
        where: { userId: userId },
      })

      // Deleting all education and work experience related to user's resume
      const resume = await prisma.resume.update({
        where: { resumeId: findUser.resume.resumeId },
        data: {
          education: {
            deleteMany: {},
          },
          workExperience: {
            deleteMany: {},
          },
        },
      })

      // Deleting user's resume
      const deleteResume = await prisma.resume.delete({
        where: { resumeId: findUser.resume.resumeId },
      })

      const user = await prisma.user.delete({
        where: { userId: userId },
      })

      return user.userId
    },

    addSkillToUser: async (_, { userId, skillId }) => {
      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },
      })

      if (!findUser) throw new Error('That user does not exist')

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
      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },
      })

      // Finding out if contact exists
      const findContact = await prisma.user.findUnique({
        where: { userId: contactId },
      })

      if (!findUser || !findContact) throw new Error('That user does not exist')

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
      // Finding out if user exists
      const findUser = await prisma.user.findUnique({
        where: { userId: userId },
      })

      // Finding out if contact exists
      const findContact = await prisma.user.findUnique({
        where: { userId: contactId },
      })

      if (!findUser || !findContact) throw new Error('That user does not exist')

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

    addEducationToResume: async (_, { input }) => {
      // Finding if user exists
      const user = await prisma.user.findUnique({
        where: { userId: input.userId },

        include: {
          resume: true,
        },
      })

      if (!user) throw new Error('That user does not exist')

      // Creating education and connecting it to resume
      const education = await prisma.education.create({
        data: {
          name: input.name,
          degree: input.degree,
          startDate: input.startDate,
          endDate: input.endDate,
          major: input.major,
          gpa: input.gpa,
          resumeId: user.resume.resumeId,
        },
      })

      return await prisma.user.findUnique({
        where: { userId: input.userId },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
          resume: true,
        },
      })
    },

    addWorkExperienceToResume: async (_, { input }) => {
      // Finding if user exists
      const user = await prisma.user.findUnique({
        where: { userId: input.userId },

        include: {
          resume: true,
        },
      })

      if (!user) throw new Error('That user does not exist')

      // Creating work experience and connecting it to resume
      const workExperience = await prisma.workExperience.create({
        data: {
          company: input.company,
          position: input.position,
          startDate: input.startDate,
          endDate: input.endDate,
          isCurrentPosition: input.isCurrentPosition,
          city: input.city,
          state: input.state,
          description: input.description,
          resumeId: user.resume.resumeId,
        },
      })

      return await prisma.user.findUnique({
        where: { userId: input.userId },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
          resume: true,
        },
      })
    },

    createJobApplication: async (_, { input }) => {
      // Finding if user exists
      const user = await prisma.user.findUnique({
        where: { userId: input.userId },

        include: {
          resume: true,
        },
      })

      if (!user) throw new Error('That user does not exist')

      return await prisma.jobApplication.create({
        data: {
          user: {
            // Connecting to user who submitted job application
            connect: { userId: input.userId },
          },
          jobPosting: {
            // Connecting to job user applied for
            connect: { jobPostId: input.jobPostId },
          },
          dateApplied: input.dateApplied,
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

      const jobApplication = await prisma.jobApplication.delete({
        where: { jobAppId: jobAppId },
      })

      return jobApplication.jobAppId
    },

    createJobPosting: async (_, { input }) => {
      // Finding if user exists
      const user = await prisma.user.findUnique({
        where: { userId: input.postedBy },

        include: {
          resume: true,
        },
      })

      if (!user) throw new Error('That user does not exist')

      // Need to create list of skill objects to connect skills to job posting
      const skillIds = input.skillsRequired.map((skillId) => ({
        skillId,
      }))

      return await prisma.jobPosting.create({
        data: {
          positionTitle: input.positionTitle,
          company: input.company,
          datePosted: input.datePosted,
          city: input.city,
          state: input.state,
          salary: input.salary,
          type: input.type,
          description: input.description,
          skillsRequired: {
            connect: skillIds,
          },
          postedBy: {
            // Connecting job post to user who created it
            connect: { userId: input.postedBy },
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

      const jobPosting = await prisma.jobPosting.delete({
        where: { jobPostId: jobPostId },
      })

      return jobPosting.jobPostId
    },

    createSkill: async (_, { name }) => {
      return await prisma.skill.create({
        data: {
          name: name,
        },
      })
    },

    deleteSkill: async (_, { skillId }) => {
      const findSkill = await prisma.skill.findUnique({
        where: { skillId: skillId },
      })

      if (!findSkill) throw new Error('That skill does not exist')

      const skill = await prisma.skill.delete({
        where: { skillId: skillId },
      })

      return skill.skillId
    },

    deleteEducation: async (_, { educationId }) => {
      const findEducation = await prisma.education.findUnique({
        where: { educationId: educationId },
      })

      if (!findEducation) throw new Error('That education does not exist')

      const education = await prisma.education.delete({
        where: { educationId: educationId },
      })

      return education.educationId
    },

    deleteWorkExperience: async (_, { workExpId }) => {
      const findWorkExp = await prisma.workExperience.findUnique({
        where: { workExpId: workExpId },
      })

      if (!findWorkExp) throw new Error('That work experience does not exist')

      const workExperience = await prisma.workExperience.delete({
        where: { workExpId: workExpId },
      })

      return workExperience.workExpId
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

  User: {
    skills: async (parent) => {
      return parent.skills.map(async (skill) => {
        return await prisma.skill.findFirst({
          where: { skillId: skill.skillId },
        })
      })
    },

    jobApplications: async (parent) => {
      return await prisma.jobApplication.findMany({
        where: { userId: parent.userId },

        include: {
          user: true,
          jobPosting: true,
        },
      })
    },

    jobPostings: async (parent) => {
      return await prisma.jobPosting.findMany({
        where: { userId: parent.userId },

        include: {
          skillsRequired: true,
          postedBy: true,
          applicants: true,
        },
      })
    },

    contacts: async (parent) => {
      return parent.contacts.map(async (contact) => {
        return await prisma.user.findUnique({
          where: { userId: contact.userId },

          include: {
            skills: true,
            jobApplications: true,
            jobPostings: true,
            contacts: true,
            resume: true,
          },
        })
      })
    },

    resume: async (parent) => {
      console.log(parent)
      return await prisma.resume.findUnique({
        where: { resumeId: parent.resume.resumeId },

        include: {
          education: true,
          workExperience: true,
        },
      })
    },
  },

  JobApplication: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { userId: parent.userId },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
          resume: true,
        },
      })
    },

    jobPosting: async (parent) => {
      return await prisma.jobPosting.findUnique({
        where: { jobPostId: parent.jobPostId },

        include: {
          skillsRequired: true,
          postedBy: true,
          applicants: true,
        },
      })
    },
  },

  JobPosting: {
    postedBy: async (parent) => {
      // Finding user who created job post
      return await prisma.user.findUnique({
        where: { userId: parent.userId },

        include: {
          skills: true,
          jobApplications: true,
          jobPostings: true,
          contacts: true,
          resume: true,
        },
      })
    },

    skillsRequired: async (parent) => {
      return parent.skillsRequired.map(async (skill) => {
        return await prisma.skill.findFirst({
          where: { skillId: skill.skillId },
        })
      })
    },

    applicants: async (parent) => {
      return parent.applicants.map(async (applicant) => {
        return await prisma.jobApplication.findFirst({
          where: { jobAppId: applicant.jobAppId },

          include: {
            jobPosting: true,
            user: true,
          },
        })
      })
    },
  },

  Resume: {
    education: async (parent) => {
      return await prisma.education.findMany({
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
