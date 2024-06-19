import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
export default function SearchBar({ value, setSearchQuery, handleSearch }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cari..."
        value={value}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TouchableOpacity onPress={handleSearch}>
        <FontAwesome name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
  },
});
