"use client";

import { gql, useMutation } from "@apollo/client";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

const CREATE_ITEM = gql`
  mutation CreateItem(
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
    $stock: Int!
    $buyPrice: Int!
    $sellPrice: Int!
    $createdAt: String!
    $storeId: ID!
  ) {
    createItem(
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
      stock: $stock
      buyPrice: $buyPrice
      sellPrice: $sellPrice
      createdAt: $createdAt
      storeId: $storeId
    ) {
      _id
      barcode
      buyPrice
      category
      createdAt
      description
      imageUrl
      name
      sellPrice
      stock
      storeId
    }
  }
`;

export default function CreateProductScreen({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [image, setImage] = useState();

  const route = useRoute();
  const storeId = route.params.storeId;
  // console.log(storeId);
  const [createItem, { data, loading, error }] = useMutation(CREATE_ITEM);

  const handleSubmit = async () => {
    try {
      const response = await createItem({
        variables: {
          name,
          imageUrl,
          description,
          category,
          stock: parseInt(stock),
          buyPrice: parseInt(buyPrice),
          sellPrice: parseInt(sellPrice),
          createdAt: new Date().toISOString(),
          storeId,
        },
      });
      console.log("Item created:", response.data.createItem);
      alert("Product successfully created!");
      navigation.navigate("ProductsScreen");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product.");
    }
  };

  const galleryUpload = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const data = new FormData();
      data.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg", // or your image type
        name: "upload.jpg",
      });
      console.log(result.assets[0].uri, "<<< uri");
      data.append("upload_preset", "qzas6lj1");
      console.log(data, "<<< ini gitu");
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dwhlzqfjp/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const dataRes = await response.json();
        // console.log(, "<<< response json");
        setImageUrl(dataRes.secure_url);
        // const imageUrl = response.data.secure_url;
        // setImageUrl(imageUrl); // Save the URL in state
        // setImage(result.uri); // Display the selected image on the UI
        // alert("Image uploaded successfully!");
      } catch (err) {
        console.error("Error uploading image:", err);
        console.log(err.message);
        alert("Failed to upload image.");
      } finally {
        setUploading(false);
      }
    }
  };

  const cameraUpload = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  // const uploadImage = async () => {
  //   try {
  //     await ImagePicker.requestCameraPermissionsAsync();
  //     let result = await ImagePicker.launchCameraAsync({
  //       cameraType: ImagePicker.cameraType.front,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       //save image
  //       await saveImage(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert("Error uploading image");
  //   }
  // };

  // const saveImage = async (image) => {
  //   try {
  //     //update displayed image
  //     setImage(image);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.innerContainer}>
          <Text style={styles.label}>Nama Produk</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Tahu Bulat"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <View style={{ flexDirection: "row", gap: 5 }}>
            <View style={{ width: "49%" }}>
              <Text style={styles.label}>Harga Beli</Text>
              <TextInput
                style={styles.inputHalf}
                placeholder="Rp0"
                keyboardType="numeric"
                value={buyPrice}
                onChangeText={(text) => setBuyPrice(text)}
              />
            </View>
            
            <View style={{ width: "49%" }}>
            <Text style={styles.label}>Harga Jual</Text>
              <TextInput
                style={styles.inputHalf}
                placeholder="Rp0"
                keyboardType="numeric"
                value={sellPrice}
                onChangeText={(text) => setSellPrice(text)}
              />
            </View>
          </View>

          <Text style={styles.label}>Deskripsi Produk</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Deskripsikan produk kamu"
            multiline={true}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          <Text style={styles.label}>Kategori</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama kategori"
            value={category}
            onChangeText={(text) => setCategory(text)}
          />

          {/* <Text style={styles.label}>Image Url</Text>
          <TextInput
            style={styles.input}
            placeholder="Image Url"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          /> */}

          <Text style={styles.label}>Stok</Text>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.inputHalf}
              placeholder="Stok"
              keyboardType="numeric"
              value={stock}
              onChangeText={(text) => setStock(text)}
            />
          </View>

          <View style={styles.imageUploadContainer}>
            {image && (
              <Image source={{ uri: image }} style={styles.imagePlaceholder} />
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={cameraUpload}
            >
              <Text style={styles.buttonOutlineText}>Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonFilled}
              onPress={galleryUpload}
            >
              <Text style={styles.buttonFilledText}>Galeri</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Simpan</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
    borderColor: "#ffa500",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#ffa500",
    fontWeight: "bold",
  },
  buttonFilled: {
    width: "48%",
    height: 50,
    backgroundColor: "#ffa500",
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
    backgroundColor: "#ffa500",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 50,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
