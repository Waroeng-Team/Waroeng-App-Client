import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { ScrollView } from "react-native-gesture-handler";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { GET_STORE_BY_ID } from "./ProductsScreen";
import { useFocusEffect } from "@react-navigation/native";
import TransactionCard from "../components/TransactionCard";

const GET_TRANSACTIONS = gql`
  query GetAllTransaction($storeId: ID) {
    getAllTransaction(storeId: $storeId) {
      _id
      type
      items {
        itemId
        quantity
        name
        sellPrice
        buyPrice
      }
      total
      storeId
      createdAt
    }
  }
`;

export default function TransactionScreen() {
  const [storeId, setStoreId] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: { storeId },
    fetchPolicy: "no-cache",
  });

  const { data: storeTransaction, refetch: refetchStoreTransaction } = useQuery(
    GET_STORE_BY_ID,
    {
      variables: { id: storeId },
      fetchPolicy: "no-cache",
    }
  );

  async function getStoreId() {
    let storeId = await SecureStore.getItemAsync("storeId");
    setStoreId(storeId);
  }

  useFocusEffect(
    useCallback(() => {
      getStoreId();
      if (storeId) {
        // console.log(storeId, "<<< store idnya nihh");
        refetch();
        refetchStoreTransaction();
      }
    }, [storeId])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.transactionContainer}>
            {data?.getAllTransaction.map((transaction, index) => {
                return <TransactionCard key={index} transaction={transaction}/>
            })} 
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  transactionContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
    padding: 20,
  },
});
