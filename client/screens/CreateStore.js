import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { GET_STORES } from "./StoresScreen";

const CREATE_STORE = gql`
  mutation CreateStore(
    $name: String
    $description: String
    $phoneNumber: String
    $address: String
    $since: String
  ) {
    createStore(
      name: $name
      description: $description
      phoneNumber: $phoneNumber
      address: $address
      since: $since
    ) {
      _id
      name
      description
      phoneNumber
      address
      since
      userId
    }
  }
`;

export default function CreateStoreScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [since, setSince] = useState("");

  const [createStore, { loading, error, data }] = useMutation(CREATE_STORE, {
    refetchQueries: [GET_STORES],
  });

  const handleCreateStore = async () => {
    try {
      const { data } = await createStore({
        variables: {
          name,
          description,
          phoneNumber,
          address,
          since,
        },
      });

      setName("");
      setDescription("");
      setPhoneNumber("");
      setAddress("");
      setSince("");
      navigation.navigate("StoresScreen");

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Nama Warung</Text>
        <TextInput
          style={styles.input}
          placeholder="Tulis nama warung"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Alamat Warung</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Tulis alamat warung mu"
          multiline={true}
        />

        <Text style={styles.label}>Nomor Telepon</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.phonePrefix}>+62</Text>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Masukkan nomor telepon"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Deskripsi Warung</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Tulis deskripsi warung kamu"
          multiline={true}
        />

        <Text style={styles.label}>Sejak</Text>
        <TextInput
          style={styles.input}
          value={since}
          onChangeText={setSince}
          placeholder="Tahun berdiri (YYYY)"
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateStore}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error.message}</Text>}
        {data && (
          <Text style={styles.successText}>Warung berhasil dibuat!</Text>
        )}
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
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  phonePrefix: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    lineHeight: 50,
  },
  phoneInput: {
    height: 50,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  successText: {
    color: "green",
    marginTop: 10,
  },
});
