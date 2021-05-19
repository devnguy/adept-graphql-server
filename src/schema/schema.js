const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar Date

  type User {
    userId: ID!
    name: String!
    email: String!
    type: UserType!
    skills: [Skill!]!
    jobApplications: [JobApplication!]!
    jobPostings: [JobPosting!]!
    contacts: [User!]!
    password: String!
    city: String
    state: String
    resume: Resume
  }

  type JobApplication {
    jobAppId: ID!
    user: User!
    jobPosting: JobPosting!
    dateApplied: String!
  }

  type JobPosting {
    jobPostId: ID!
    positionTitle: String!
    company: String!
    datePosted: String!
    city: String
    state: String
    salary: Int
    type: JobType!
    description: String!
    skillsRequired: [Skill!]!
    postedBy: User!
    applicants: [JobApplication!]!
  }

  type Skill {
    skillId: ID!
    name: String!
  }

  type Education {
    educationId: ID!
    name: String!
    degree: String!
    startDate: String!
    endDate: String!
    major: String!
    gpa: Float
  }

  type WorkExperience {
    workExpId: ID!
    company: String!
    position: String!
    startDate: String!
    endDate: String
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  type Resume {
    resumeId: ID!
    education: [Education!]!
    workExperience: [WorkExperience!]!
  }

  enum UserType {
    EMPLOYEE
    EMPLOYER
  }

  enum JobType {
    FULL_TIME
    PART_TIME
    INTERNSHIP
  }

  input registerUserInput {
    name: String!
    email: String!
    type: UserType!
    password: String!
  }

  type registerUserResponse {
    userId: ID!
    name: String!
    email: String!
    type: UserType!
  }

  input UpdateUserLocationInput {
    userId: String!
    city: String!
    state: String!
  }

  input AddEducationToResumeInput {
    userId: String!
    name: String!
    degree: String!
    startDate: String!
    endDate: String!
    major: String!
    gpa: Float
  }

  input AddWorkExperienceToResumeInput {
    userId: String!
    company: String!
    position: String!
    startDate: String!
    endDate: String
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  input CreateJobApplicationInput {
    jobPostId: String!
    userId: String!
    dateApplied: String
  }

  input CreateJobPostingInput {
    positionTitle: String!
    company: String!
    datePosted: String
    city: String
    state: String
    salary: Int
    type: JobType!
    description: String!
    skillsRequired: [ID!]!
    postedBy: ID!
  }

  type LoginUserResponse {
    token: String
    user: User
  }

  type Query {
    getUserById(userId: ID!): User
    searchUsers(name: String): [User!]!
    currentUser: User!
    getJobApplicationById(jobAppId: ID!): JobApplication
    getAllJobApplications: [JobApplication!]!
    getJobPostingById(jobPostId: ID!): JobPosting
    getAllJobPostings: [JobPosting!]!
    searchJobPostings(
      positionTitle: String
      company: String
      city: String
      state: String
    ): [JobPosting!]!
    getSkillById(skillId: ID!): Skill
    getAllSkills: [Skill!]!
    searchSkills(name: String): [Skill!]!
  }

  type Mutation {
    registerUser(input: registerUserInput!): registerUserResponse
    loginUser(email: String!, password: String!): LoginUserResponse
    updateUserLocation(input: UpdateUserLocationInput!): User!
    deleteUser(userId: ID!): ID!
    addSkillToUser(userId: ID!, skillId: ID!): User!
    deleteSkillFromUser(userId: ID!, skillId: ID!): User!
    addContactToUser(userId: ID!, contactId: ID!): User!
    removeContactFromUser(userId: ID!, contactId: ID!): User!
    addEducationToResume(input: AddEducationToResumeInput!): User!
    addWorkExperienceToResume(input: AddWorkExperienceToResumeInput!): User!

    createJobApplication(input: CreateJobApplicationInput!): JobApplication!
    deleteJobApplication(jobAppId: ID!): ID!

    createJobPosting(input: CreateJobPostingInput!): JobPosting!
    deleteJobPosting(jobPostId: ID!): ID!

    createSkill(name: String!): Skill!
    deleteSkill(skillId: ID!): ID!

    deleteEducation(educationId: ID!): ID!
    deleteWorkExperience(workExpId: ID!): ID!
  }
`

module.exports = typeDefs
