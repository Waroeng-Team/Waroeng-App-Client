import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export default function ProductCard({ imageUrl, name, price, handleBuy }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{price}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              /* Handle edit */
            }}>
            <Text style={styles.editButtonText}>Ubah</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              /* Handle delete */
            }}>
            <Text style={styles.deleteButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <TouchableOpacity style={styles.addButton} onPress={handleBuy}>
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   productsContainer: {
//     flex: 1,
//     width: "100%",
//     padding: 20,
//   },
//   productCard: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     margin: 10,
//     padding: 15,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#999",
//   },
// });
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
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#81d4fa",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ef5350",
    borderRadius: 5,
    padding: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productImage: {
    resizeMode: "contain",
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  addButton: {
    borderColor: "#ef5350",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  addButtonText: {
    color: "#ef5350",
    fontWeight: "bold",
  },
});
