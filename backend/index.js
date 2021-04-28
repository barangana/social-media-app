const { ApolloServer } = require("apollo-server");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");
const mongoose = require("mongoose");
const { MONGODB } = require("./config");

// Creates an apollo server with GraphQL typeDefs and resolvers destructured.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// Connects to the mongo database on port 5000 with the Apollo server.
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
