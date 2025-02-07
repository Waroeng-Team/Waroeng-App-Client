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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EditProductScreen from "./screens/EditProductScreen";

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
        const token = await SecureStore.getItemAsync("access_token");
        if (token) {
          const decoded = jwtDecode(token);
          // console.log(decoded);
          if (decoded.isNewAccount == true) {
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
    <GestureHandlerRootView>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <Stack.Navigator>
              {isSignedIn ? (
                // isNewAccount ? (
                //   <>
                //     <Stack.Screen
                //       name="CreateStoreScreen"
                //       component={CreateStoreScreen}
                //       options={{ title: "Create Store" }}
                //     />
                //     <Stack.Screen
                //       name="DrawerNavigator"
                //       component={DrawerNavigator}
                //       options={{ headerShown: false }}
                //     />
                //   </>
                // ) : (
                //   <>
                //     <Stack.Screen
                //       name="DrawerNavigator"
                //       component={DrawerNavigator}
                //       options={{ headerShown: false }}
                //     />
                //     <Stack.Screen
                //       name="CreateProductScreen"
                //       component={CreateProductScreen}
                //       options={{ title: "Tambah produk baru" }}
                //     />
                //   </>
                // )
                <>
                  <Stack.Screen
                    name="DrawerNavigator"
                    component={DrawerNavigator}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="CreateProductScreen"
                    component={CreateProductScreen}
                    options={{ title: "Tambah produk baru" }}
                  />
                  <Stack.Screen
                    name="EditProductScreen"
                    component={EditProductScreen}
                    options={{ title: "Edit produk" }}
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
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ApolloProvider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
