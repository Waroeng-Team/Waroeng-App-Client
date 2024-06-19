import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function ProductCard({
  product,
  handleBuy,
  handleReduceBuy,
  isCancel,
  boughtItem,
}) {
  const { name, sellPrice, stock, barcode, imageUrl } = product;
  const [amount, setAmount] = useState(boughtItem ? boughtItem.quantity : 0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState(null);

  useEffect(() => {
    if (isCancel) {
      setAmount(0);
    }
  }, [isCancel]);

  useEffect(() => {
    if (boughtItem) {
      setAmount(boughtItem.quantity);
    }
  }, [boughtItem]);

  useEffect(() => {
    if (amount === stock && amount !== 0) {
      Alert.alert("Warning", "Stok habis");
    }
  }, [amount, stock]);

  console.log(amount, "<<<<<<<");

  const disabled = stock <= 0 || amount === stock;

  const save = () => {
    qrCodeSvg.toDataURL(async (data) => {
      const uri = FileSystem.cacheDirectory + "qrcode.png";
      await FileSystem.writeAsStringAsync(uri, data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri);

      Alert.alert("Success", "QR Code saved to gallery.");
    });
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(sellPrice)}
        </Text>
        <Text style={styles.productStock}>Stock: {stock}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              /* Handle edit */
            }}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.newButtonText}>Buat barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for QR code */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <QRCode
                value={barcode || product._id}
                getRef={(c) => setQrCodeSvg(c)}
              />
              <TouchableOpacity style={styles.downloadButton} onPress={save}>
                <Text style={styles.downloadButtonText}>Download QR Code</Text>
              </TouchableOpacity>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        {amount === 0 || isCancel ? (
          <TouchableOpacity
            style={[styles.addButton, disabled && styles.disabledButton]}
            disabled={disabled}
            onPress={() => {
              setAmount(1);
              handleBuy(product, 1); // Tambahkan parameter quantity
            }}>
            <Text style={styles.addButtonText}>Beli</Text>
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
                handleBuy(product, 1); // Tambahkan parameter quantity
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
    backgroundColor: "#2196f3",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  newButton: {
    backgroundColor: "#ff9800",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
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
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#81c784",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  downloadButton: {
    backgroundColor: "#4caf50",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
