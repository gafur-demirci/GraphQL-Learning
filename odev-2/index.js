const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const {events, locations, users, participants} = require('./data');

const typeDefs = gql`
    type Event {
        id : Int!,
        title : String,
        desc : String,
        date : String,
        from : String,
        to : String,
        location_id : Int,
        user_id : Int
        user : User!
        location : Location!
        participants : [Participant!]!
    }

    type Location {
        id : Int!,
        name : String,
        desc : String,
        lat : Float,
        lng : Float
    }

    type User {
        id : Int!,
        username : String,
        email : String
    }

    type Participant {
        id : Int!,
        user_id : Int,
        event_id : Int
    }

    type Query {
        # events
        events : [Event!]
        event(id: Int!) : Event!

        # locations
        locations : [Location!]
        location(id: Int!) : Location!

        # users
        users : [User!]
        user(id:Int!) : User!

        # participants
        participants : [Participant!]
        participant(id:Int!) : Participant
    }
`;

const resolvers = {
    Query: {
        events : () => events,
        event : (parameter, args) => events.find((event) => event.id === args.id),

        locations : () => locations,
        location : (parameter, args) => locations.find((location) => location.id === args.id),

        users : () => users,
        user : (parameter,args) => users.find((user) => user.id === args.id),

        participants : () => participants,
        participant : (parameter,args) => participants.find((participant) => participant.id === args.id),
    },
    Event: {
        user: (parent) => users.find((user) => user.id === parent.user_id),

        location: (parent) => locations.find((location) => location.id === parent.location_id),

        participants: (parent) => participants.filter((participant) => participant.event_id === parent.id),

    }
};

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]   
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});