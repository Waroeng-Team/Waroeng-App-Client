import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export const GET_ALL_ITEMS = gql`
  query GetAllItems($storeId: ID!, $search: String) {
    getAllItems(storeId: $storeId, search: $search) {
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
  query GetStoreById($id: ID!) {
    getStoreById(_id: $id) {
      _id
      name
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($type: String, $items: [ItemInput], $storeId: ID) {
    addTransaction(type: $type, items: $items, storeId: $storeId) {
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

export const GET_ITEM_BY_ID = gql`
  query GetItemById($storeId: ID!, $productId: ID!) {
    getItemById(storeId: $storeId, productId: $productId) {
      _id
      name
      imageUrl
      description
      category
      stock
      buyPrice
      sellPrice
      createdAt
      storeId
      barcode
    }
  }
`;

const ProductsScreen = ({ navigation }) => {
  const [storeId, setStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bought, setBought] = useState([]);
  const [isBuy, setIsBuy] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [addTransaction, { loading: addTransactionLoading }] = useMutation(
    ADD_TRANSACTION,
    {
      refetchQueries: [
        { query: GET_ALL_ITEMS, variables: { storeId, search: searchQuery } },
      ],
    }
  );

  const { loading, error, data, refetch } = useQuery(GET_ALL_ITEMS, {
    variables: { storeId, search: searchQuery },
    fetchPolicy: "network-only",
    skip: !storeId,
  });

  const { data: storeDetail, refetch: refetchStoreDetail } = useQuery(
    GET_STORE_BY_ID,
    {
      variables: { id: storeId },
      fetchPolicy: "network-only",
      skip: !storeId,
    }
  );

  useFocusEffect(
    useCallback(() => {
      getStoreId();
    }, [])
  );

  const getStoreId = async () => {
    try {
      const storedId = await SecureStore.getItemAsync("storeId");
      if (storedId) {
        setStoreId(storedId);
      } else {
        navigation.navigate("StoresScreen");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get Store ID.");
    }
  };

  const handleBuy = (item, quantity = 1) => {
    setIsBuy(true);
    setIsCancel(false);
    const itemIsBought = bought.find(
      (boughtItem) => boughtItem.itemId === item._id
    );

    if (!itemIsBought) {
      setBought([
        ...bought,
        { itemId: item._id, quantity, price: item.sellPrice },
      ]);
    } else {
      setBought(
        bought.map((boughtItem) =>
          boughtItem.itemId === item._id
            ? { ...boughtItem, quantity: boughtItem.quantity + quantity }
            : boughtItem
        )
      );
    }
  };

  const handleReduceBuy = (item) => {
    setIsBuy(true);
    setIsCancel(false);
    const itemIsBought = bought.find(
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
  }, [bought]);

  const handleBuyTransaction = async () => {
    try {
      const items = bought.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      }));

      const transaction = {
        type: "income",
        items,
        storeId,
      };

      const res = await addTransaction({ variables: transaction });
      setIsCancel(true);
      setIsBuy(false);
      setBought([]);
      refetch();
      navigation.navigate("TransactionScreen");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleScanSuccess = (input) => {
    setScanning(false);
    setScanned(true);

    const productId = input.data;

    const product = data.getAllItems.find((item) => item._id === productId);

    if (product) {
      handleBuy(product);
    } else {
      Alert.alert("Error", "Produk tidak ditemukan");
    }
  };

  const renderContent = () => {
    if (!storeId) return <Text>Loading..</Text>;
    if (loading) return <Text>Loading..</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    if (!data || !data.getAllItems.length) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Tidak ada produk</Text>
          <TouchableOpacity
            style={styles.chooseStoreButton}
            onPress={() => navigation.navigate("StoresScreen")}>
            <Text style={styles.chooseStoreButtonText}>Pilih warung</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{storeDetail?.getStoreById.name}</Text>
          <SearchBar
            value={searchQuery}
            onChange={(query) => setSearchQuery(query)}
            onSubmit={() => refetch()}
          />
          <View style={styles.productsContainer}>
            {data.getAllItems.map((product, index) => {
              const boughtItem = bought.find(
                (boughtItem) => boughtItem.itemId === product._id
              );

              return (
                <ProductCard
                  key={index}
                  handleBuy={handleBuy}
                  handleReduceBuy={handleReduceBuy}
                  product={product}
                  boughtItem={boughtItem}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  if (!permission || permission.granted === false) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission.granted) {
    Alert.alert(
      "Permission Denied",
      "You need to grant camera permission to use this feature"
    );
    return null;
  }

  return (
    <>
      {renderContent()}

      {isBuy && bought.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>
              Rp{new Intl.NumberFormat("id-ID").format(totalPrice)}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={handleBuyTransaction}>
              <Text style={styles.buyButtonText}>Beli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelBuy}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isBuy && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("CreateProductScreen", { storeId })
          }>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {scanning && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleScanSuccess}
          />
          <View style={styles.overlay}>
            <View style={styles.overlayRow}>
              <View style={styles.overlayEdge} />
              <View style={styles.cameraOverlay} />
              <View style={styles.overlayEdge} />
            </View>
            <View style={styles.overlayRow}>
              <View style={styles.overlayEdge} />
              <View style={styles.cameraOverlay} />
              <View style={styles.overlayEdge} />
            </View>
            <View style={styles.overlayRow}>
              <View style={styles.overlayEdge} />
              <View style={styles.cameraOverlay} />
              <View style={styles.overlayEdge} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.cancelScanButton}
            onPress={() => setScanning(false)}>
            <Text style={styles.cancelScanButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      )}

      {!scanning && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {
            setScanning(true);
            setScanned(false); // Reset scanned to false when starting to scan
          }}>
          <Text style={styles.scanButtonText}>Scan QR</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  camera: {
    width: 300,
    height: 300,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlayEdge: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cameraOverlay: {
    width: 300,
    height: 300,
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
    backgroundColor: "#ffa500",
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
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffa500",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scanButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e90ff",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  buyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelScanButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  cancelScanButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProductsScreen;
