import { NavigationContainer } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import ProductsScreen from "../screens/ProductsScreen";
import CreateStoreScreen from "../screens/CreateStore";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import StoresScreen from "../screens/StoresScreen";
import ReportScreen from "../screens/ReportScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { setIsSignedIn } = useContext(AuthContext);

  async function handleLogout() {
    try {
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("storeId");
      setIsSignedIn(false);
    } catch (error) {
      console.log(error);
    }
  }

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={handleLogout} />
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
    // initialRouteName={}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* <Drawer.Screen name="Dashboard" component={}/> */}
      <Drawer.Screen
        name="ProductsScreen"
        options={{ title: "Products" }}
        component={ProductsScreen}
      />
      <Drawer.Screen name="CreateStore" component={CreateStoreScreen} />
      <Drawer.Screen name="StoresScreen" component={StoresScreen} />
      <Drawer.Screen name="ReportScreen" component={ReportScreen} />
    </Drawer.Navigator>
  );
}
