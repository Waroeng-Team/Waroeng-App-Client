import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://warungku.yugoboy.online",
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
