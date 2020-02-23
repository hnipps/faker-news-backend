const { GraphQLServer } = require("graphql-yoga");

// 1
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.find(item => item.id === args.id)
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const currentLink = links.find(item => item.id === args.id);
      const newLink = {
        id: args.id,
        description: args.description
          ? args.description
          : currentLink.description,
        url: args.url ? args.url : currentLink.url
      };
      const linkIndex = links.findIndex(item => item.id === args.id);
      links.splice(linkIndex, 1, newLink);
      return newLink;
    },
    deleteLink: (parent, args) => {
      const deletedLink = links.find(item => item.id === args.id);
      links = links.filter(item => item.id !== args.id);
      return deletedLink;
    }
  }
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
