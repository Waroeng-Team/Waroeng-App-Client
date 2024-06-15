import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateStoreScreen from "./screens/CreateStore";
import CreateProductScreen from "./screens/CreateProductScreen";
import DrawerNavigator from "./navigators/DrawerNavigator";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(isSignedIn);

  useEffect(() => {
    async function getToken() {
      try {
        const token = await SecureStore.getItem("access_token");
        if (token) {
          setIsSignedIn(true);
          console.log(token, "<<<");
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
              <>
                {/* <Stack.Screen
                  name="CreateStoreScreen"
                  component={CreateStoreScreen}
                />
                <Stack.Screen
                  name="CreateProductScreen"
                  options={{ title: "Create Product" }}
                  component={CreateProductScreen}
                /> */}
                <Stack.Screen
                  name="DrawerNavigator"
                  component={DrawerNavigator}
                  options={{ headerShown: false }}
                />
              </>
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
