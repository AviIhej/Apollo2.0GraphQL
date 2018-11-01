// This is the practice file for the project.
// I want to be able to type every single line withoyt any external help

// Require ApolloServer
const { AppoloServer, gql } = require('apollo-server');

const employees = [
    {
        name: "Mike",
        id: 1,
        employerId: 1,
    },
    {
        name: "Mike",
        id: 2,
        employerId: 1,
    },
    {
        name: "Mike",
        id: 3,
        employerId: 2,
    },
    {
        name: "Mike",
        id: 4,
        employerId: 2,
    },
]

const employers = [
    {
        id: "1",
        name: "Google",
    },
    {
        id: "1",
        name: "Facebook",
    },
    {
        id: "1",
        name: "Twitter",
    },
]

const typeDefs = gql`
    type Query {
        employers: [Employer]
        employees: [Employee]
        employer(id: Int): Employer
        employee(id: Int): Employee
    }
`