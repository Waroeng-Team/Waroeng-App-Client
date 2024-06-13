import { NavigationContainer } from "@react-navigation/native";
// import ProductsScreen from "./screens/ProductsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProductsScreen from "../screens/ProductsScreen";
import CreateStoreScreen from "../screens/CreateStore";

const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen name="Dashboard" component={}/> */}
      <Drawer.Screen
        name="ProductsScreen"
        options={{ title: "Products" }}
        component={ProductsScreen}
      />
      <Drawer.Screen name="CreateStore" component={CreateStoreScreen} />
    </Drawer.Navigator>
  );
}
