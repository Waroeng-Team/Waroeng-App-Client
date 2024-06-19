import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

function formatDate(anyDate) {
  const date = new Date(parseInt(anyDate));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}

function formatTotal(amount) {
  if (typeof amount !== "number") {
    return "Invalid amount";
  }

  const fixedAmount = Math.round(amount * 100) / 100;

  const formatted = fixedAmount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });

  return formatted;
}

export default function TransactionCard({ transaction }) {
  const navigation = useNavigation();

  const transactionTypeStyle =
    transaction.type === "income"
      ? styles.incomeTransaction
      : styles.outcomeTransaction;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.transactionDateAtt}>Tanggal Transaksi</Text>
      </View>
      <Text style={styles.transactionDateText}>
        {formatDate(transaction.createdAt)}
      </Text>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {/* <View style={{ backgroundColor: "red" }}> */}
        <Text style={styles.attributeTitle}>Tipe Transaksi</Text>
        {/* </View> */}
        <View style={transactionTypeStyle}>
          <Text style={{ color: "white" }}>{`  ${transaction.type}  `}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={styles.attributeTitle}>Total Transaksi</Text>
        <Text>{formatTotal(transaction.total)}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={styles.attributeTitle}>Produk</Text>
        <Text>
          {transaction.items.map((item, index) => {
            const isLastItem = index === transaction.items.length - 1;
            return isLastItem ? `${item.name}.` : `${item.name}, `;
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    gap: 3,
    backgroundColor: "#ffe4b3",
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  transactionDateAtt: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDateText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 3,
  },
  incomeTransaction: {
    backgroundColor: "green",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  outcomeTransaction: {
    backgroundColor: "red",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
});
