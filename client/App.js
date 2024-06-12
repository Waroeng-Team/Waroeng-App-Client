import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateStoreScreen from "./screens/CreateStore";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    // <NavigationContainer>
    //   <View>
    //     <Text>Hi</Text>
    //   </View>
    // </NavigationContainer>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateStoreScreen">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CreateStoreScreen" component={CreateStoreScreen} />
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
