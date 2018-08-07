const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");
const UserType = require("./types/user");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      description: "The current user ID'd by an API key",
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, { key }, { loaders }) => {
        return loaders.usersByApiKey.load(key);
      }
    }
  }
});

const AddContestMutation = require("./mutations/add-contest");

const RootMutationType = new GraphQLObjectType({
  name: "RootMutationType",
  fields: () => ({
    AddContest: AddContestMutation
    // AddName: AddNameMutation
  })
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;
