import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://2a55-2404-8000-1001-69bc-7046-8b5e-8ffe-e714.ngrok-free.app",
});

const authLink = setContext(async (_, { headers }) => {
  try {
    // get the authentication token from local storage if it exists
    const token = await SecureStore.getItemAsync("access_token");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (error) {
    console.log(error);
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
