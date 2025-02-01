import { ApolloServer, gql } from "apollo-server";

const todos = [
	{
		id: "1",
		title: "Learn GraphQL",
		completed: false,
	},
	{
		id: "2",
		title: "Learn TypeScript",
		completed: false,
	},
];

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: ID!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

const resolvers = {
	Query: {
		getTodos: () => todos,
	},
	Mutation: {
		addTodo: (_: unknown, { title }: { title: string }) => {
			const newTodo = {
				id: String(todos.length + 1),
				title,
				completed: false,
			};
			todos.push(newTodo);
			return newTodo;
		},
		updateTodo: (
			_: unknown,
			{ id, completed }: { id: string; completed: boolean },
		) => {
			const todo = todos.find((todo) => todo.id === id);
			if (!todo) {
				throw new Error(`Todo with id ${id} not found`);
			}
			todo.completed = completed;
			return todo;
		},
		deleteTodo: (_: unknown, { id }: { id: string }) => {
			const todo = todos.findIndex((todo) => todo.id === id);
			if (todo === -1) {
				throw new Error(`Todo with id ${id} not found`);
			}
			const deletedTodo = todos.splice(todo, 1);
			return deletedTodo[0];
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
