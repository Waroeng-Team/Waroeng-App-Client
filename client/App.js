import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateStoreScreen from "./screens/CreateStore";
import CreateProductScreen from "./screens/CreateProductScreen";
// import ProductsScreen from "./screens/ProductsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigator from "./navigators/DrawerNavigator";

// const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CreateStoreScreen" component={CreateStoreScreen} />
        <Stack.Screen
          name="CreateProductScreen"
          options={{ title: "Create Product" }}
          component={CreateProductScreen}
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
