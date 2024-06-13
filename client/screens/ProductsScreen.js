import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ProductCard from "../components/ProductCard";
import { useState, useLayoutEffect } from "react";
import SearchBar from "../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";

export default function ProductsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  //dummy data products
  const products = [
    {
      id: "1",
      name: "Beng Beng",
      price: "250000",
      imageUrl: "https://www.mayora.com/storage/files/2017-bengbeng.png",
    },
    {
      id: "1",
      name: "Astro",
      price: "999000",
      imageUrl: "https://www.mayora.com/storage/files/coki.png",
    },
    {
      id: "1",
      name: "blok",
      price: "5000",
      imageUrl: "https://www.mayora.com/storage/files/astor.png",
    },
    {
      id: "1",
      name: "blok",
      price: "5000",
      imageUrl: "https://www.mayora.com/storage/files/astor.png",
    },
    {
      id: "1",
      name: "blok",
      price: "5000",
      imageUrl: "https://www.mayora.com/storage/files/astor.png",
    },
    {
      id: "1",
      name: "blok",
      price: "5000",
      imageUrl: "https://www.mayora.com/storage/files/astor.png",
    },
    {
      id: "1",
      name: "blok",
      price: "5000",
      imageUrl: "https://www.mayora.com/storage/files/astor.png",
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      ),
    });
  }, [navigation, searchQuery]);

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Snack</Text>
          <View style={styles.productsContainer}>
            {products.map((product, id) => {
              return (
                <ProductCard
                  key={id}
                  imageUrl={product.imageUrl}
                  name={product.name}
                  price={product.price}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateProductScreen")}
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
});
