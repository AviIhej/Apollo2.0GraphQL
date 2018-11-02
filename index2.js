// This is the practice file for the project.
// I want to be able to type every single line withoyt any external help

// Require ApolloServer
const { ApolloServer, gql } = require('apollo-server');

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
        employerId: 3,
    },
]

const employers = [
    {
        id: 1,
        name: "Google",
    },
    {
        id: 2,
        name: "Facebook",
    },
    {
        id: 3,
        name: "Twitter",
    },
]

// TYPEDEFS TYPEDEFS TYPEDEFS
const typeDefs = gql`
    type Query {
        employers: [Employer]
        employees: [Employee]
        employer(id: Int): Employer
        employee(id: Int): Employee
    }
    
    type Employer {
        id: Int
        name: String
        employees: [Employee]
        numEmployees: Int
    }

    type Employee {
        id: Int
        name: String
        employer: Employer
        employerId: Int
    }

    type Mutation {
        addEmployee(employerId: Int!, name: String!): Employee
        removeEmployee(id: Int!): [Employee]
        changeEmployeeName(id: Int!, name: String!): Employee
        changeEmployer(id: Int!, employerId: Int!): Employee
    }
`

// RESOLVERS RESOLVERS RESOLVERS
const resolvers = {
    Query: {
        employer: (parentValue, args, context, info) => employers.filter(e => e.id === args.id)[0],
        employee: (parentValue, args, context, info) => employees.filter(e => e.id === args.id)[0],
        employers: () => employers,
        employees: () => employees
    },

    Employer: {
        // Custom resolver functions under this employer data type
        numEmployees: (parentValue) => {
            console.log(`The parentValue in Employer: `, parentValue);
            return employees.filter(e => e.employerId === parentValue.id).length
        },
        // employees returns an array of employees
        employees: () =>{
            return employees.filter(e => e.employerId === parentValue.id)
        },
    },

    Employee: {
        employer: (parentValue) => {
            // to return one employer
            return employers.filter(e => e.id ===  parentValue.employerId)[0]
        }
    },
    Mutation: {
        addEmployee: (_, args) => {
            const newEmployee = {
                id: employees.length + 1,
                name: args.name,
                employerId: args.employerId
            }
            employees.push(newEmployee)
            return newEmployee
        },
        removeEmployee: (_, args) => {
            return employees.filter(e => e.id !== args.id)
        },
        changeEmployeeName: (_,args) => {
            let newEmployee;
            // Change employees array
            employees = employees.map(e => {
                if(e.id === args.id){
                    newEmployee ={
                        ...e,
                        name: args.name,
                    };
                return newEmployee
                }
                //if condition is not matched return e
                return e;
            })
            // return changed employee
            return newEmployee
        },
        changeEmployer: (_, args) => {
            let newEmployee;
            employees = employees.map(e => {
                if(e.id === args.id){
                    newEmployee = {
                        ...e,
                        employerId: args.employerId
                    }
                    // adds the newEmployee to the employees Arrat
                    return newEmployee
                }
                return e
                // If none of these conditions are met, then just return e, aka keep traversing through the list of employees
            })
            // Finally return an employee, like as we specified the return type would be in the typedef
            return newEmployee
        },
    },
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({ url }) => {
    console.log(`🚀 Server Listening on port ${url}🚀 `);
})

// fieldName(obj, args, context, info) { result }
// These arguments have the following meanings and conventional names:

// obj: The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.
// args: An object with the arguments passed into the field in the query. For example, if the field was called with author(name: "Ada"), the args object would be: { "name": "Ada" }.
// context: This is an object shared by all resolvers in a particular query, and is used to contain per-request state, including authentication information, dataloader instances, and anything else that should be taken into account when resolving the query. If you’re using Apollo Server, read about how to set the context in the setup documentation.
// info: This argument should only be used in advanced cases, but it contains information about the execution state of the query, including the field name, path to the field from the root, and more. It’s only documented in the GraphQL.js source code.