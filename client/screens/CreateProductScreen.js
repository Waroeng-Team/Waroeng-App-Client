import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from "react-native";

export default function CreateProductScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Nama Produk</Text>
        <TextInput style={styles.input} placeholder="Contoh: Tahu Bulat" />

        <Text style={styles.label}>Harga Beli</Text>
        <View style={styles.priceInputContainer}>
          <TextInput style={styles.inputHalf} placeholder="Rp0" keyboardType="numeric" />
          <TextInput style={styles.inputHalf} placeholder="Rp0" keyboardType="numeric" />
        </View>

        <Text style={styles.label}>Deskripsi Produk</Text>
        <TextInput style={[styles.input, { height: 100 }]} placeholder="Deskripsikan produk kamu" multiline={true} />

        <Text style={styles.label}>Kategori</Text>
        <TextInput style={styles.input} placeholder="Nama kategori" />

        <View style={styles.imageUploadContainer}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.imagePlaceholder} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => {
              /* Handle camera upload */
            }}
          >
            <Text style={styles.buttonOutlineText}>Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonFilled}
            onPress={() => {
              /* Handle gallery upload */
            }}
          >
            <Text style={styles.buttonFilledText}>Galeri</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            /* Handle save */
          }}
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  imageUploadContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonOutline: {
    width: "48%",
    height: 50,
    borderWidth: 1,
    borderColor: "#FF0000",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  buttonFilled: {
    width: "48%",
    height: 50,
    backgroundColor: "#FF0000",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFilledText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    height: 50,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});