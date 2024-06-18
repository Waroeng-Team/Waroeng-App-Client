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

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
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
