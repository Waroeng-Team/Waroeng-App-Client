// Dashboard.js

import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView } from "react-native";
import Card from "../components/Cards";

const Dashboard = () => {
  const cardsData = [
    { title: "Transaksi Lunas", subtitle: "Rp 250 000" },
    { title: "Tunai", subtitle: "Rp 250 000" },
    { title: "Omzet", subtitle: "Rp 250 000" },
    { title: "Transaksi Piutang", subtitle: "Rp 250 000" },
    { title: "Piutang Terbayar", subtitle: "Rp 250 000" },
    { title: "Produk Terjual", subtitle: "Rp 250 000" },
    { title: "Non Tunai", subtitle: "Rp 250 000" },
    { title: "Profit", subtitle: "Rp 250 000" },
    { title: "Piutang", subtitle: "Rp 250 000" },
    { title: "Sisa Piutang", subtitle: "Rp 2 500 000" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View>
              <Text style={styles.title}>Hello Matthew</Text>
              <Text style={styles.subtitle}>Welcome back!</Text>
            </View>
            <Image source={{ uri: "https://blueraycargo.id/wp-content/uploads/2023/04/rahasia-sukses-orang-china.jpeg" }} style={styles.profileImage} />
          </View>

          {/* Period Section */}
          <View style={styles.timestampContainer}>
            <Text style={styles.period}>Periode </Text>
            <Text style={[styles.year, { color: "#FFA500", fontWeight: "800" }]}>Tahun 2024</Text>
          </View>

          {/* Last Updated Section */}
          <View>
            <Text style={styles.update}>Terakhir Diperbaharui </Text>
            <Text style={styles.date}>11-06-2924 12:22:40 </Text>
          </View>
        </View>

        {/* Text Box Section */}
        <View style={styles.textBoxContainer}>
          <Text style={styles.textBoxTitle}>Informasi</Text>
          <Text style={styles.textBoxContent}>Lorem ipsum dolor sit amet consectetur. Et in montes sed aliquam. Auctor sollicitudin arcu pellentesque turpis blandit pretium. </Text>
        </View>

        <View style={styles.CardsContainer}>
          <View style={styles.leftColumn}>
            {cardsData.slice(0, 5).map((card, index) => (
              <Card key={index} title={card.title} subtitle={card.subtitle} />
            ))}
          </View>
          <View style={styles.rightColumn}>
            {cardsData.slice(5).map((card, index) => (
              <Card key={index} title={card.title} subtitle={card.subtitle} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 8,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  period: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 0,
    marginRight: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  update: {
    marginTop: 12,
    fontSize: 16,
  },
  date: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
  year: {
    fontSize: 24,
    marginLeft: 1,
  },
  CardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  leftColumn: {
    flex: 1,
    marginRight: 18,
  },
  rightColumn: {
    flex: 1,
    marginRight: 40,
  },
  textBoxContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#dddd",
    borderRadius: 10,
    marginTop: 20,
  },
  textBoxTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FFA500",
  },
  textBoxContent: {
    fontSize: 14,
    color: "#666",
  },
});

export default Dashboard;
