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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProductCard({
  product,
  handleBuy,
  handleReduceBuy,
  isCancel,
  boughtItem,
  successBuy,
  isCancelAddStock, //------
  handleAddStock, //------
  handleReduceAddStock, //------
}) {
  const { name, sellPrice, stock, barcode, imageUrl } = product;
  const [amount, setAmount] = useState(boughtItem ? boughtItem.quantity : 0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState(null);
  const [amountAddStock, setAmountAddStock] = useState(0); //------
  const navigation = useNavigation();

  //------bawah
  useEffect(() => {
    if (isCancelAddStock) {
      setAmountAddStock(0);
    }
  }, [isCancelAddStock]);
  ///------atas

  useEffect(() => {
    if (successBuy === true) {
      setAmount(0);
    }
  });

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

  // console.log(amount, "<<<<<<<");

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
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <View style={styles.cardContent}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.productName}>{name}</Text>
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(sellPrice)}
          </Text>
          <Text style={styles.productStock}>Stock: {stock}</Text>

          {/* Modal for QR code */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <QRCode
                  value={barcode || product._id}
                  getRef={(c) => setQrCodeSvg(c)}
                />
                <TouchableOpacity style={styles.downloadButton} onPress={save}>
                  <Text style={styles.downloadButtonText}>
                    Download QR Code
                  </Text>
                </TouchableOpacity>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        {amount === 0 || isCancel ? (
          <>
            <TouchableOpacity
              style={[styles.addButton, disabled && styles.disabledButton]}
              disabled={disabled}
              onPress={() => {
                setAmount(1);
                handleBuy(product, 1); // Tambahkan parameter quantity
              }}
            >
              <Text style={styles.addButtonText}>Beli</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                setAmount(amount - 1);
                handleReduceBuy(product);
              }}
            >
              <Text style={styles.removeButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.amountText}>{amount}</Text>
            <TouchableOpacity
              style={[styles.addButton, disabled && styles.disabledButton]}
              disabled={disabled}
              onPress={() => {
                setAmount(amount + 1);
                handleBuy(product, 1); // Tambahkan parameter quantity
              }}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            navigation.navigate("EditProductScreen", {
              product,
              productId: product._id,
              storeId: product.storeId,
            });
          }}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      {/* ---tambah stock--- */}
      {amountAddStock === 0 || isCancelAddStock ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#ffa500",
            width: "100%",
            marginTop: 6,
            borderRadius: 5,
            paddingBottom: 8,
            paddingTop: 8,
          }}
          onPress={() => {
            setAmountAddStock(1);
            handleAddStock(product);
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Tambah stock
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            marginTop:5
          }}
        >
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              setAmountAddStock(amountAddStock - 1);
              handleReduceAddStock(product);
            }}
          >
            <Text style={styles.removeButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.amountText}>{amountAddStock}</Text>
          <TouchableOpacity
            style={[styles.addButton]}
            onPress={() => {
              setAmountAddStock(amountAddStock + 1);
              handleAddStock(product);
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* ---tambah stock--- */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    width: "100%",
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
    flex: 1,
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
    borderRadius: 5,
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
    flex: 1,
  },
  addButton: {
    backgroundColor: "#81c784",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
    flex: 1,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    flex: 1,
    textAlign: "center",
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
