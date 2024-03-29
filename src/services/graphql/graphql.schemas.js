
// Define the combined GraphQL schema. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let moduleExports = `
type ChatMessage {
  id: ID
  _id: ID
  ownerId: ID
  userId: ID
  teamId: ID
  roleId: ID
  msg: String
  team(query: JSON, params: JSON, key: JSON): Team
  role(query: JSON, params: JSON, key: JSON): Role
  owner(query: JSON, params: JSON, key: JSON): User!
  user(query: JSON, params: JSON, key: JSON): User
}
 
type LogMessage {
  id: ID
  _id: ID
  gr: String
  pr: Int
  name: String
  ownerId: ID
  userId: ID
  msg: String
  owner(query: JSON, params: JSON, key: JSON): User
  user(query: JSON, params: JSON, key: JSON): User
}
 
type OpcuaTag {
  id: ID
  _id: ID
  isEnable: Boolean
  browseName: String
  displayName: String
  aliasName: String
  description: String
  type: String
  ownerName: String
  dataType: String
  hist: Int
  store: JSON
  group: Boolean
  subscription: String
  ownerGroup: String
  bindMethod: String
  inputArguments: [JSON]
  outputArguments: [JSON]
  userAccessLevel: JSON
  variableGetType: String
  getter: String
  getterParams: JSON
  valueParams: JSON
  valueFromSourceParams: JSON
  histParams: JSON
  view: JSON
}
 
type OpcuaValue {
  id: ID
  _id: ID
  tagId: ID
  tagName: String
  storeStart: String
  storeEnd: String
  store: JSON
  opcuaData: [JSON]
  tag(query: JSON, params: JSON, key: JSON): OpcuaTag
}
 
type Role {
  id: ID
  _id: ID
  name: String
  alias: String
  description: String
  users: [User!]
}
 
type Team {
  id: ID
  _id: ID
  name: String
  alias: String
  description: String
  members: [User!]
}
 
type UserProfile {
  id: ID
  _id: ID
  personalPhone: String
  personalWebSite: String
  addressSuite: String
  addressStreet: String
  addressCity: String
  addressState: String
  addressStateAbbr: String
  addressCountry: String
  addressCountryCode: String
  addressZipCode: String
  addressLatitude: String
  addressLongitude: String
  jobCompanyName: String
  jobTitle: String
  jobType: String
  jobPhone: String
  jobWebSite: String
  jobEmail: String
  addressFull: String!
  user: User!
}
 
type UserTeam {
  id: ID
  _id: ID
  teamId: ID
  userId: ID
}
 
type User {
  id: ID
  _id: ID
  email: String
  firstName: String
  lastName: String
  avatar: String
  roleId: ID
  profileId: ID
  active: Boolean
  isVerified: Boolean
  verifyToken: String
  verifyShortToken: String
  verifyExpires: String
  verifyChanges: JSON
  resetToken: String
  resetShortToken: String
  resetExpires: String
  googleId: String
  githubId: String
  googleAccessToken: String
  googleRefreshToken: String
  githubAccessToken: String
  githubRefreshToken: String
  loginAt: String
  fullName: String!
  role(query: JSON, params: JSON, key: JSON): Role
  profile(query: JSON, params: JSON, key: JSON): UserProfile
  teams: [Team!]
}
 

type Query {
  getChatMessage(key: JSON, query: JSON, params: JSON): ChatMessage
  findChatMessage(query: JSON, params: JSON): [ChatMessage]!
  getLogMessage(key: JSON, query: JSON, params: JSON): LogMessage
  findLogMessage(query: JSON, params: JSON): [LogMessage]!
  getOpcuaTag(key: JSON, query: JSON, params: JSON): OpcuaTag
  findOpcuaTag(query: JSON, params: JSON): [OpcuaTag]!
  getOpcuaValue(key: JSON, query: JSON, params: JSON): OpcuaValue
  findOpcuaValue(query: JSON, params: JSON): [OpcuaValue]!
  getRole(key: JSON, query: JSON, params: JSON): Role
  findRole(query: JSON, params: JSON): [Role]!
  getTeam(key: JSON, query: JSON, params: JSON): Team
  findTeam(query: JSON, params: JSON): [Team]!
  getUserProfile(key: JSON, query: JSON, params: JSON): UserProfile
  findUserProfile(query: JSON, params: JSON): [UserProfile]!
  getUserTeam(key: JSON, query: JSON, params: JSON): UserTeam
  findUserTeam(query: JSON, params: JSON): [UserTeam]!
  getUser(key: JSON, query: JSON, params: JSON): User
  findUser(query: JSON, params: JSON): [User]!
}
`;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
