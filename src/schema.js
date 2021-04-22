const { gql } = require('apollo-server')
const { GraphQLScalarType, Kind } = require('graphql')

// Source: https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // Convert hard-coded AST string to integer and then to Date
    }
    return null // Invalid hard-coded value (not an integer)
  },
})

const typeDefs = gql`
  type User {
    id: ID!
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
    id: ID!
    user: User!
    jobPosting: JobPosting!
    dateApplied: Date!
  }

  type JobPosting {
    id: ID!
    skillsRequired: [Skill!]!
    positionTitle: String!
    company: String!
    datePosted: Date!
    city: String
    state: String
    salary: Int
    type: JobType!
    description: String!
    applicants: [JobApplication!]!
  }

  type Skill {
    id: ID!
    name: String!
  }

  type School {
    id: ID!
    name: String!
    degree: String!
    startDate: Int!
    endDate: Int!
    major: String!
    gpa: Float
  }

  type WorkExperience {
    id: ID!
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
    id: ID!
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
    id: ID!
    name: String!
    email: String!
    type: UserType!
  }

  input UpdateUserLocationInput {
    id: ID!
    city: String!
    state: String!
  }

  type UpdateUserLocationResponse {
    id: ID!
    city: String!
    state: String!
  }

  input AddSkillToUserInput {
    id: ID!
    skills: [Skill!]!
  }

  type AddSkillToUserResponse {
    id: ID!
    skills: [Skill!]!
  }

  input DeleteSkillFromUserInput {
    id: ID!
    skills: [Skill!]!
  }

  type DeleteSkillFromUserResponse {
    id: ID!
    skills: [Skill!]!
  }

  input AddJobApplicationToUserInput {
    id: ID!
    jobApplications: [JobApplication!]!
  }

  type addJobApplicationToUserResponse {
    id: ID!
    jobApplications: [JobApplication!]!
  }

  input AddJobPostingToUserInput {
    id: ID!
    jobPostings: [JobPosting!]!
  }

  type AddJobPostingToUserResponse {
    id: ID!
    jobPostings: [JobPosting!]!
  }

  input AddSchoolInput {
    name: String!
    degree: String!
    startDate: Int!
    endDate: Int!
    major: String!
    gpa: Float
  }

  type AddSchoolToResumeResponse {
    id: ID!
    name: String!
    degree: String!
    startDate: Int!
    endDate: Int!
    major: String!
    gpa: Float
  }

  input AddWorkExperienceInput {
    company: String!
    position: String!
    startDate: Int!
    endDate: Int
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  type addWorkExperienceToResumeResponse {
    id: ID!
    company: String!
    position: String!
    startDate: Int!
    endDate: Int
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  type Query {
    getUserById(id: ID!): User
    searchUsers(name: String): [User!]!
    getJobApplicationById(id: ID!): JobApplication
    getAllJobApplications: [JobApplication!]!
    getJobPostingById(id: ID!): JobPosting
    getAllJobPostings: [JobPosting!]!
    searchJobPostings(
      positionTitle: String
      company: String
      location: String
    ): [JobPosting!]!
    getSkillById(id: ID!): Skill
    searchSkills(name: String): [Skill!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse
    updateUserLocation(
      input: UpdateUserLocationInput!
    ): UpdateUserLocationResponse
    deleteUser(id: ID!): DeleteUserResponse
    addSkillToUser(input: AddSkillToUserInput!): AddSkillToUserResponse
    deleteSkillFromUser(
      input: DeleteSkillFromUserInput!
    ): DeleteSkillFromUserResponse
    addJobApplicationToUser(
      input: AddJobApplicationToUserInput!
    ): addJobApplicationToUserResponse
    addJobPostingToUser(
      input: AddJobPostingToUserInput!
    ): AddJobPostingToUserResponse
    addSchoolToResume(input: AddSchoolInput!): AddSchoolToResumeResponse
    addWorkExperienceToResume(
      input: AddWorkExperienceInput!
    ): addWorkExperienceToResumeResponse

    createJobApplication(
      input: CreateJobApplication!
    ): CreateJobApplicationResponse
    deleteJobApplication(id: ID!): deleteJobApplicationResponse

    createJobPosting(input: CreateJobPostingInput!): createJobPostingResponse
    addJobApplicationToJobPosting(
      input: AddJobApplicationToJobPostingInput!
    ): AddJobApplicationToJobPostingResponse
    deleteJobPosting(id: ID!): DeleteJobPostingResponse

    createSkill(input: CreateSkillInput!): CreateSkillResponse

    deleteSchool(id: ID!): DeleteSchoolResponse
  }
`

module.exports = typeDefs
