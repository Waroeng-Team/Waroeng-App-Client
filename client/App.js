import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateStoreScreen from "./screens/CreateStore";
import CreateProductScreen from "./screens/CreateProductScreen";
import DrawerNavigator from "./navigators/DrawerNavigator";
import { ApolloProvider, gql } from "@apollo/client";
import client from "./config/apollo";
import { useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const Stack = createNativeStackNavigator();

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID) {
    getUserById(_id: $id) {
      _id
      email
      isNewAccount
      name
    }
  }
`;

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAccount, setIsNewAccount] = useState(false);

  useEffect(() => {
    async function getToken() {
      try {
        const token = await SecureStore.getItem("access_token");
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.isNewAccount) {
            setIsNewAccount(true);
          }
          setIsSignedIn(true);
        }
        if (!token) {
          setIsSignedIn(false);
        }
      } finally {
        setIsLoading(false);
      }
    }
    getToken();
  }, []);
  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            {isSignedIn ? (
              isNewAccount ? (
                <>
                  <Stack.Screen
                    name="CreateStoreScreen"
                    component={CreateStoreScreen}
                    options={{ title: "Create Store" }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="DrawerNavigator"
                    component={DrawerNavigator}
                    options={{ headerShown: false }}
                  />
                </>
              )
            ) : (
              <>
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="RegisterScreen"
                  component={RegisterScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
