const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')
const pgdb = require('../database/pgdb')
const UserType = require('./types/user')

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      description: "The current user ID'd by an API key",
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, { key }, { pgPool }) => {
        console.log('get user by key', key)
        return pgdb(pgPool).getUser(key)
      }
    }
  }
})

const ncSchema = new GraphQLSchema({
  query: RootQueryType
})

module.exports = ncSchema
