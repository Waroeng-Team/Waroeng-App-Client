import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateStoreScreen from "./screens/CreateStore";
import CreateProductScreen from "./screens/CreateProductScreen";
import Dashboard from "./screens/Dashboard";
import Homescreen from "./screens/Home";
import Ionicons from "@expo/vector-icons/Ionicons"; // Import Ionicons

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Homescreen" component={Homescreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CreateStoreScreen" component={CreateStoreScreen} />
        <Stack.Screen name="CreateProductScreen" component={CreateProductScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert("Menu button pressed")}>
                <Ionicons name="menu" size={25} color="#000" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            headerTitleAlign: "center", // Align the title in the center
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
