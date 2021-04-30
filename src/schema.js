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
    dateApplied: Date!
  }

  type JobPosting {
    jobPostId: ID!
    positionTitle: String!
    company: String!
    datePosted: Date!
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

  type School {
    schoolId: ID!
    name: String!
    degree: String!
    startDate: Int!
    endDate: Int!
    major: String!
    gpa: Float
  }

  type WorkExperience {
    workExpId: ID!
    company: String!
    position: String!
    startDate: Int!
    endDate: Int
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  type Resume {
    resumeId: ID!
    education: [School!]!
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

  input CreateUserInput {
    name: String!
    email: String!
    type: UserType!
    password: String!
  }

  type CreateUserResponse {
    userId: ID!
    name: String!
    email: String!
    type: UserType!
  }

  input UpdateUserLocationInput {
    userId: ID!
    city: String!
    state: String!
  }

  input AddSchoolInput {
    userId: ID!
    name: String!
    degree: String!
    startDate: Date!
    endDate: Date!
    major: String!
    gpa: Float
  }

  input AddWorkExperienceInput {
    userId: ID!
    company: String!
    position: String!
    startDate: Date!
    endDate: Date
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  input CreateJobApplicationInput {
    jobPostId: ID!
    userId: ID!
    dateApplied: Date
  }

  input CreateJobPostingInput {
    positionTitle: String!
    company: String!
    datePosted: Date
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
    # getAllJobApplicationsByUser(userId: ID!): [JobApplication!]!
    # getAllJobApplicationsForJobPosting(jobPostId: ID!): [JobApplication!]!
    getJobPostingById(jobPostId: ID!): JobPosting
    getAllJobPostings: [JobPosting!]!
    searchJobPostings(
      positionTitle: String
      company: String
      location: String
    ): [JobPosting!]!
    getSkillById(skillId: ID!): Skill
    getAllSkills: [Skill!]!
    searchSkills(name: String): [Skill!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse
    updateUserLocation(input: UpdateUserLocationInput!): User!
    deleteUser(userId: ID!): User!
    addSkillToUser(userId: ID!, skillId: ID!): User!
    deleteSkillFromUser(userId: ID!, skillId: ID!): User!
    # addJobApplicationToUser(userId: ID!, jopAppId: ID!): User!
    # addJobPostingToUser(userId: ID!, jobPostingId: ID!): User!
    addContactToUser(userId: ID!, contactId: ID!): User!
    removeContactFromUser(userId: ID!, contactId: ID!): User!
    addSchoolToResume(input: AddSchoolInput!): User!
    addWorkExperienceToResume(input: AddWorkExperienceInput!): User!

    createJobApplication(input: CreateJobApplicationInput!): JobApplication!
    deleteJobApplication(jobAppId: ID!): JobApplication!

    createJobPosting(input: CreateJobPostingInput!): JobPosting!
    addJobApplicationToJobPosting(jobAppId: ID!, jobPostId: ID!): JobPosting!
    deleteJobPosting(jobPostId: ID!): JobPosting!

    createSkill(name: String!): Skill!

    deleteSchool(schoolId: ID!): ID!
    deleteWorkExperience(workExpId: ID!): ID!

    # TODO: Integrate with createUser
    registerUser(email: String!, password: String!): User!
    loginUser(email: String!, password: String!): LoginUserResponse
  }
`

module.exports = typeDefs
