// CardComponent.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = ({ title, subtitle }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    maxWidth: 400,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "800",
  },
});

export default Card;
