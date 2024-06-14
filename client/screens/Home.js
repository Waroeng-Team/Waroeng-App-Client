import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

export default function Homescreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Dashboard");
        }}
      >
        <Text style={styles.buttonText}>Go To Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#b22222",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
