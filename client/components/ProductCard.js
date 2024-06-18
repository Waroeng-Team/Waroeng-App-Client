import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProductCard({
  product,
  handleBuy,
  handleReduceBuy,
  isCancel,
}) {
  const { name, sellPrice, stock, imageUrl } = product;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (isCancel) {
      setAmount(0);
    }
  }, [isCancel]);

  const disabled = stock <= 0 || amount === stock;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(sellPrice)}</Text>
        <Text style={styles.productStock}>Stock: {stock}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              /* Handle edit */
            }}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {amount === 0 || isCancel ? (
          <TouchableOpacity
            style={[styles.addButton, disabled && styles.disabledButton]}
            disabled={disabled}
            onPress={() => {
              setAmount(1);
              handleBuy(product);
            }}>
            <Text style={styles.addButtonText}>Tambah</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                setAmount(amount - 1);
                handleReduceBuy(product);
              }}>
              <Text style={styles.removeButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.amountText}>{amount}</Text>
            <TouchableOpacity
              style={[styles.addButton, disabled && styles.disabledButton]}
              disabled={disabled}
              onPress={() => {
                setAmount(amount + 1);
                handleBuy(product);
              }}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388e3c",
    marginBottom: 5,
  },
  productStock: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#81d4fa",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#81c784",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center"
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  removeButton: {
    backgroundColor: "#ef5350",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
