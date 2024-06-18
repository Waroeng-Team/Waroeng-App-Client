import { View, TextInput, StyleSheet } from "react-native";
export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cari..."
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width:150
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
