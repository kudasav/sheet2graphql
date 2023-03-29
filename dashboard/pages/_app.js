import '../styles/globals.css'
import { ApolloProvider } from "@apollo/client";
import Layout from "../components/layout"
import client from "../apollo-client";

function App({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ApolloProvider>
	)
}

export default App
