import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ProductCard from "../components/ProductCard";
import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { gql, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

export const GET_ALL_ITEMS = gql`
  query GetAllItems($storeId: ID!) {
    getAllItems(storeId: $storeId) {
      _id
      name
      category
      description
      imageUrl
      stock
      buyPrice
      sellPrice
      storeId
      barcode
      createdAt
    }
  }
`;

export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: ID) {
    getStoreById(_id: $id) {
      _id
      name
    }
  }
`;

export default function ProductsScreen({ navigation }) {
  const [storeId, setStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredProducts, setFilteredProducts] = useState(products);
  const { loading, error, data, refetch } = useQuery(GET_ALL_ITEMS, {
    variables: { storeId },
    fetchPolicy: "no-cache",
  });

  const { data: storeDetail, refetch: refetchStoreDetail } = useQuery(
    GET_STORE_BY_ID,
    {
      variables: { id: storeId },
      fetchPolicy: "no-cache",
    }
  );

  async function getStoreId() {
    let storeId = await SecureStore.getItemAsync("storeId");
    setStoreId(storeId);
  }
  //dummy data products

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      ),
    });
  }, [navigation, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      getStoreId();
      if (storeId) {
        console.log(storeId, "<<< store idnya");
        refetch();
        refetchStoreDetail();
      }
    }, [storeId])
  );
  return (
    <>
      {data?.getAllItems.length == 0 || !data ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No items</Text>
          <TouchableOpacity
            style={styles.chooseStoreButton}
            onPress={() => navigation.navigate("StoresScreen")}
          >
            <Text style={styles.chooseStoreButtonText}>Choose your store</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>{storeDetail?.getStoreById.name}</Text>
            <View style={styles.productsContainer}>
              {data?.getAllItems.map((product, index) => {
                return (
                  <ProductCard
                    key={index}
                    imageUrl={product.imageUrl}
                    name={product.name}
                    price={product.sellPrice}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          //add a console log
          {
            console.log(storeId, "<<< store id ke klik");
            navigation.navigate("CreateProductScreen", { storeId: storeId });
          }
        }
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productsContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
    padding: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 10,
    padding: 15,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: "#999",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#888",
  },
  chooseStoreButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  chooseStoreButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});
