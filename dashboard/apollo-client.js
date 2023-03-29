import { ApolloClient, InMemoryCache, createHttpLink, split, ApolloProvider, from } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { getCookie } from 'cookies-next';


const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const cache = new InMemoryCache({
	typePolicies: {
		typePolicies: {},
		Query: {fields: {}},
	},
});

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			'Authorization': getCookie('token') ? 'JWT '+getCookie('token') : ''
		},
	};
});

export const client = new ApolloClient({
	link: from([authLink.concat(httpLink)]),
	cache: cache
});

export default client;