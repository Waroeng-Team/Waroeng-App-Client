import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from "react-native";

export default function CreateStoreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Nama Warung</Text>
        <TextInput style={styles.input} placeholder="Tulis nama warung" />

        <Text style={styles.label}>Alamat Warung</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Tulis alamat warung mu"
          multiline={true}
        />

        <Text style={styles.label}>Nomor Telepon</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.phonePrefix}>+62</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Masukkan nomor telepon"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Deskripsi Warung</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Tulis deskripsi warung kamu"
          multiline={true}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* Handle save */
            navigation.navigate("StoresScreen");
          }}
        >
          <Text style={styles.buttonText}>Simpan</Text>
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
});
