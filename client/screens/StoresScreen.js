import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import StoreCard from "../components/StoreCard";
import { gql, useQuery } from "@apollo/client";

export const GET_STORES = gql`
  query GetAllStores {
    getAllStores {
      _id
      address
      description
      name
      phoneNumber
      since
      userId
    }
  }
`;

export default function StoresScreen({ navigation }) {
  //   const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_STORES, {
    fetchPolicy: "no-cache",
  });

  //dummy data stores
  // const stores = [
  //   {
  //     id: "1",
  //     name: "Gaming Store",
  //     phoneNumber: "+123456789",
  //     description: "for your gaming equipment",
  //     address: "sesame street",
  //   },
  //   {
  //     id: "2",
  //     name: "Tech Gadgets",
  //     phoneNumber: "+987654321",
  //     description: "latest tech and gadgets",
  //     address: "tech valley road",
  //   },
  //   {
  //     id: "3",
  //     name: "Book Haven",
  //     phoneNumber: "+112233445",
  //     description: "a paradise for book lovers",
  //     address: "literature lane",
  //   },
  //   {
  //     id: "4",
  //     name: "Home Essentials",
  //     phoneNumber: "+556677889",
  //     description: "all your household needs",
  //     address: "domestic drive",
  //   },
  // ];

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Warung Anda</Text>
          <View style={styles.productsContainer}>
            {data?.getAllStores.map((store, index) => {
              return (
                <StoreCard
                  key={index}
                  name={store.name}
                  phoneNumber={store.phoneNumber}
                  description={store.description}
                  address={store.address}
                  storeId={store._id}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ProductsScreen")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </>
  );
}

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
