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
    userId: Int!
    name: String!
    email: String!
    type: UserType!
  }

  type DeleteUserResponse {
    userId: ID!
  }

  input UpdateUserLocationInput {
    userId: ID!
    city: String!
    state: String!
  }

  type UpdateUserLocationResponse {
    user: User!
  }

  input AddSkillToUserInput {
    userId: ID!
    skillId: ID!
  }

  type AddSkillToUserResponse {
    user: User!
  }

  input DeleteSkillFromUserInput {
    userId: ID!
    skillId: ID!
  }

  type DeleteSkillFromUserResponse {
    user: User!
  }

  input AddJobApplicationToUserInput {
    userId: ID!
    jobApplicationId: ID!
  }

  type AddJobApplicationToUserResponse {
    user: User!
  }

  input AddJobPostingToUserInput {
    userId: ID!
    jobPostingId: ID!
  }

  type AddJobPostingToUserResponse {
    user: User!
  }

  input AddContactToUserInput {
    userId: ID!
    contactId: ID!
  }

  type AddContactToUserResponse {
    user: User!
  }

  input AddSchoolInput {
    userId: ID!
    name: String!
    degree: String!
    startDate: Int!
    endDate: Int!
    major: String!
    gpa: Float
  }

  type AddSchoolToResumeResponse {
    user: User!
  }

  input AddWorkExperienceInput {
    userId: ID!
    company: String!
    position: String!
    startDate: Int!
    endDate: Int
    isCurrentPosition: Boolean!
    city: String
    state: String
    description: String!
  }

  type AddWorkExperienceToResumeResponse {
    user: User!
  }

  input CreateJobApplicationInput {
    jobPostingId: ID!
  }

  type CreateJobApplicationResponse {
    jobApplication: JobApplication!
  }

  type DeleteJobApplicationResponse {
    deletedJobApplicationId: ID!
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

  type CreateJobPostingResponse {
    jobPosting: JobPosting!
  }

  input AddJobApplicationToJobPostingInput {
    jobApplicationId: ID!
    jobPostingId: ID!
  }

  type AddJobApplicationToJobPostingResponse {
    jobPosting: JobPosting!
  }

  type DeleteJobPostingResponse {
    deletedJobPostingId: ID!
  }

  input CreateSkillInput {
    name: String!
  }

  type CreateSkillResponse {
    skill: Skill!
  }

  type DeleteSchoolResponse {
    deletedSchoolId: ID!
  }

  type LoginUserResponse {
    token: String
    user: User
  }

  type Query {
    getUserById(id: ID!): User
    searchUsers(name: String): [User!]!
    currentUser: User!
    getJobApplicationById(id: ID!): JobApplication
    getAllJobApplications: [JobApplication!]!
    getJobPostingById(id: ID!): JobPosting
    getAllJobPostings: [JobPosting!]!
    searchJobPostings(
      positionTitle: String
      company: String
      location: String
    ): [JobPosting!]!
    getAllSkills: [Skill!]!
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
    ): AddJobApplicationToUserResponse
    addJobPostingToUser(
      input: AddJobPostingToUserInput!
    ): AddJobPostingToUserResponse
    addContactToUser(input: AddContactToUserInput): AddContactToUserResponse
    addSchoolToResume(input: AddSchoolInput!): AddSchoolToResumeResponse
    addWorkExperienceToResume(
      input: AddWorkExperienceInput!
    ): AddWorkExperienceToResumeResponse

    createJobApplication(
      input: CreateJobApplicationInput!
    ): CreateJobApplicationResponse
    deleteJobApplication(id: ID!): DeleteJobApplicationResponse

    createJobPosting(input: CreateJobPostingInput!): CreateJobPostingResponse
    addJobApplicationToJobPosting(
      input: AddJobApplicationToJobPostingInput!
    ): AddJobApplicationToJobPostingResponse
    deleteJobPosting(id: ID!): DeleteJobPostingResponse

    createSkill(input: CreateSkillInput!): CreateSkillResponse

    deleteSchool(id: ID!): DeleteSchoolResponse

    # TODO: Integrate with createUser
    registerUser(email: String!, password: String!): User!
    loginUser(email: String!, password: String!): LoginUserResponse
  }
`

module.exports = typeDefs
