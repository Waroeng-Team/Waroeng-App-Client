import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const StoreCard = ({ name, address, storeId }) => {
  const navigation = useNavigation();

  async function handleOnChooseStore() {
    await SecureStore.setItemAsync("storeId", storeId);
    navigation.navigate("ProductsScreen");
  }

  return (
    <View style={styles.card}>
      <Text style={styles.storeName}>{name}</Text>
      <Text style={styles.address}>{address}</Text>
      <TouchableOpacity style={styles.button} onPress={handleOnChooseStore}>
        <Text style={styles.buttonText}>Choose this store</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  card: {
    backgroundColor: "#f1f9ff",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#b3e5fc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
  },
});
export default StoreCard;
