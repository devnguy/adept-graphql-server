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
    type: UserType!
    skills: [Skill!]!
    jobApplications: [JobApplication!]!
    jobPostings: [JobPosting!]!
    contacts: [User!]!
    password: String!
    location: Location!
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
    company: String!
    datePosted: Date!
    location: Location!
    salary: Int
    type: JobType!
    description: String!
  }

  type Skill {
    id: ID!
    name: String!
  }

  type Location {
    id: ID!
    city: String!
    state: String!
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
    location: Location!
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
`

module.exports = typeDefs
