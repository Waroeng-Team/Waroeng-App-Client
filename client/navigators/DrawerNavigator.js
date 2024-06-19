import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import TransactionScreen from "../screens/TransactionScreen";
import { Ionicons } from "@expo/vector-icons";

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
    const labelStyle = {
      fontSize: 16,
      color: "gray",
    };
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Keluar"
          onPress={handleLogout}
          labelStyle={labelStyle}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
      // initialRouteName={}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#ffa500",
        drawerInactiveTintColor: "gray",
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      {/* <Drawer.Screen name="Dashboard" component={}/> */}
      <Drawer.Screen
        name="ProductsScreen"
        options={{
          title: "Products",
          drawerIcon: () => (
            <Ionicons name="bag-handle-outline" size={24} color="black" />
          ),
        }}
        component={ProductsScreen}
      />
      <Drawer.Screen
        name="CreateStore"
        component={CreateStoreScreen}
        options={{
          title: "Daftarkan Warung",
          drawerIcon: () => (
            <Ionicons name="add-circle-outline" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="StoresScreen"
        component={StoresScreen}
        options={{
          title: "WarungKu",
          drawerIcon: () => (
            <Ionicons name="storefront-outline" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          title: "Laporan",
          drawerIcon: () => (
            <Ionicons name="bar-chart-outline" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="TransactionScreen"
        component={TransactionScreen}
        options={{
          title: "Daftar Transaksi",
          drawerIcon: () => (
            <Ionicons name="newspaper-outline" size={24} color="black" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
