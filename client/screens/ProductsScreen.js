import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ProductCard from "../components/ProductCard";
import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { gql, useMutation, useQuery } from "@apollo/client";
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

export const ADD_TRANSACTION = gql`
  mutation Addtransaction($type: String, $items: [ItemInput], $storeId: ID) {
    addtransaction(type: $type, items: $items, storeId: $storeId) {
      _id
      type
      items {
        itemId
        quantity
      }
      total
      storeId
      createdAt
    }
  }
`;
export default function ProductsScreen({ navigation }) {
  const [storeId, setStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bought, setBought] = useState([]);
  const [isBuy, setIsBuy] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addTransaction, { loading: addTransactionLoading }] =
    useMutation(ADD_TRANSACTION);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      ),
    });
  }, [navigation, searchQuery]);

  const handleBuy = (item) => {
    setIsBuy(true);
    setIsCancel(false);
    let itemIsBought = bought.find(
      (boughtItem) => boughtItem.itemId === item._id
    );

    if (!itemIsBought) {
      setBought([
        ...bought,
        { itemId: item._id, quantity: 1, price: item.sellPrice },
      ]);
    } else {
      setBought(
        bought.map((boughtItem) =>
          boughtItem.itemId === item._id
            ? { ...boughtItem, quantity: boughtItem.quantity + 1 }
            : boughtItem
        )
      );
    }
  };

  const handleReduceBuy = (item) => {
    setIsBuy(true);
    setIsCancel(false);
    let itemIsBought = bought.find(
      (boughtItem) => boughtItem.itemId === item._id
    );

    if (itemIsBought) {
      if (itemIsBought.quantity > 1) {
        setBought(
          bought.map((boughtItem) =>
            boughtItem.itemId === item._id
              ? { ...boughtItem, quantity: boughtItem.quantity - 1 }
              : boughtItem
          )
        );
      } else if (itemIsBought.quantity === 1) {
        setBought(
          bought.filter((boughtItem) => boughtItem.itemId !== item._id)
        );
      }
    }
  };

  const handleCancelBuy = () => {
    setIsBuy(false);
    setIsCancel(true);
    setBought([]);
  };

  useEffect(() => {
    const total = bought.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
    // console.log(bought);
  }, [bought]);

  //* Click button buy
  const handleBuyTransaction = async () => {
    try {
      const items = bought.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      }));
      // console.log("🚀 ~ items ~ items:", items);

      const transaction = {
        type: "income",
        items,
        storeId,
      };
      // console.log("🚀 ~ handleBuyTransaction ~ transaction:", transaction);

      const result = await addTransaction({ variables: transaction });
      console.log("🚀 ~ handleBuyTransaction ~ result:", result);
      setIsCancel(true);
      setIsBuy(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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
                    handleBuy={handleBuy}
                    handleReduceBuy={handleReduceBuy}
                    setBought={setBought}
                    isCancel={isCancel}
                    product={product}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      {isBuy && bought.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "white",
              borderRadius: 10,
              margin: 8,
              borderColor: "grey",
              borderWidth: 1,
            }}
          >
            <View
              style={{ paddingLeft: 15, paddingTop: 10, paddingBottom: 10 }}
            >
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>Total</Text>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                Rp {totalPrice}
              </Text>
            </View>
            <View
              style={{ justifyContent: "center", paddingRight: 10, gap: 5 }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFD700",
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 10,
                }}
                onPress={handleBuyTransaction}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    alignSelf: "center",
                  }}
                >
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: "red",
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 10,
                }}
                onPress={handleCancelBuy}
              >
                <Text
                  style={{ color: "red", fontWeight: "bold", fontSize: 20 }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("CreateProductScreen", { storeId })
          }
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
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
