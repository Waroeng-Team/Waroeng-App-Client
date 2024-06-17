import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { GET_STORE_BY_ID } from "./ProductsScreen";
import { gql, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const GET_DAILY_REPORT = gql`
  query GetReportByDay($storeId: ID, $date: String) {
    getReportByDay(storeId: $storeId, date: $date) {
      _id
      profit
      totalIncome
      totalOutcome
      transactionDetail {
        _id
        items {
          itemId
          quantity
        }
        type
        total
        createdAt
      }
    }
  }
`;

export const GET_WEEKLY_REPORT = gql`
  query GetReportByWeek($storeId: ID, $date: String) {
    getReportByWeek(storeId: $storeId, date: $date) {
      _id
      profit
      totalIncome
      totalOutcome
      transactionDetail {
        _id
        items {
          itemId
          quantity
        }
        type
        total
        createdAt
      }
    }
  }
`;

export const GET_MONTHLY_REPORT = gql`
  query GetReportByMonth($storeId: ID, $date: String) {
    getReportByMonth(storeId: $storeId, date: $date) {
      _id
      profit
      totalIncome
      totalOutcome
      transactionDetail {
        _id
        items {
          itemId
          quantity
        }
        type
        total
        createdAt
      }
    }
  }
`;

export const GET_YEARLY_REPORT = gql`
  query GetReportByYear($storeId: ID, $date: String) {
    getReportByYear(storeId: $storeId, date: $date) {
      _id
      profit
      totalIncome
      totalOutcome
      transactionDetail {
        _id
        items {
          itemId
          quantity
        }
        type
        total
        createdAt
      }
    }
  }
`;

export default function ReportScreen({ navigation }) {
  const [storeId, setStoreId] = useState("");
  const [typeReport, setTypeReport] = useState("");
  const [date, setDate] = useState("");
  const [report, setReport] = useState({});
  const [errorFetch, setErrorFetch] = useState(false);
  const { data: storeDetail, refetch: refetchStoreDetail } = useQuery(
    GET_STORE_BY_ID,
    {
      variables: { id: storeId },
      fetchPolicy: "no-cache",
    }
  );

  const { data: reportDaily } = useQuery(GET_DAILY_REPORT, {
    variables: { storeId, date },
    fetchPolicy: "no-cache",
  });
  const { data: reportWeekly } = useQuery(GET_WEEKLY_REPORT, {
    variables: { storeId, date },
    fetchPolicy: "no-cache",
  });
  const { data: reportMonthly } = useQuery(GET_MONTHLY_REPORT, {
    variables: { storeId, date },
    fetchPolicy: "no-cache",
  });
  const { data: reportYearly } = useQuery(GET_YEARLY_REPORT, {
    variables: { storeId, date },
    fetchPolicy: "no-cache",
  });
  async function getStoreId() {
    let storeId = await SecureStore.getItemAsync("storeId");
    setStoreId(storeId);
  }

  const emojisWithIcons = [
    { title: "Daily" },
    { title: "Weekly" },
    { title: "Monthly" },
    { title: "Yearly" },
  ];
  const handleSeeReport = () => {
    switch (typeReport) {
      case "":
        return setErrorFetch(true);
      case "Daily":
        if (!reportDaily) {
          return setErrorFetch(true);
        }
        setReport(reportDaily.getReportByDay);
        setErrorFetch(false);
        break;
      case "Weekly":
        if (!reportWeekly) {
          return setErrorFetch(true);
        }
        setReport(reportWeekly.getReportByWeek);
        setErrorFetch(false);
        break;
      case "Monthly":
        if (!reportMonthly) {
          return setErrorFetch(true);
        }
        setReport(reportMonthly.getReportByMonth);
        setErrorFetch(false);
        break;
      case "Yearly":
        if (!reportYearly) {
          return setErrorFetch(true);
        }
        setReport(reportYearly.getReportByYear);
        setErrorFetch(false);
        break;
    }
    if (!date) {
      setErrorFetch(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStoreId();
      if (storeId) {
        refetchStoreDetail();
      }
    }, [storeId])
  );
  if (!storeId) {
    return (
      <>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Not yet select store</Text>
          <TouchableOpacity
            style={styles.chooseStoreButton}
            onPress={() => navigation.navigate("StoresScreen")}
          >
            <Text style={styles.chooseStoreButtonText}>Choose your store</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  return (
    <>
      {report?._id ? (
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            {storeDetail?.getStoreById.name}
          </Text>

          <View
            style={{
              borderTopWidth: 2,
              marginRight: 5,
              marginLeft: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 5,
                paddingBottom: 5,
                borderBottomWidth: 2,
              }}
            >
              <Text>Transaction date</Text>
              <Text>Income</Text>
              <Text>Outcome</Text>
            </View>
            {report?.transactionDetail.map((transaction, index) => {
              let timestamp = +transaction.createdAt;
              let date = `${new Date(timestamp)}`;
              date = date.split(" ");
              let convertDate = [date[2], date[1], date[3]];
              convertDate = convertDate.join("-");
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                  }}
                  key={index}
                >
                  <Text>{convertDate}</Text>
                  <Text style={{ color: "green" }}>
                    {transaction.type == "income"
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(transaction.total)
                      : "Rp 0"}
                  </Text>
                  <Text style={{ color: "red" }}>
                    {transaction.type == "outcome"
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(transaction.total)
                      : "Rp 0"}
                  </Text>
                </View>
              );
            })}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 5,
              marginRight: 5,
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Profit:</Text>
            <Text style={{ fontWeight: "bold" }}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(report.profit)}
            </Text>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FFD700",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => {
                setReport({});
                setDate("");
                setTypeReport("");
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>{storeDetail?.getStoreById.name}</Text>
          <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
            {errorFetch ? (
              <Text style={{ color: "red" }}>No Transaction</Text>
            ) : (
              ""
            )}
            <View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}
              >
                Type:
              </Text>
              <SelectDropdown
                data={emojisWithIcons}
                onSelect={(selectedItem, index) => {
                  setTypeReport(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) || "Choose"}
                      </Text>
                      <Icon
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        style={styles.dropdownButtonArrowStyle}
                      />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: "#D2D9DF" }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="MM-DD-YYYY"
                onChangeText={(e) => setDate(e)}
              />
            </View>
            <TouchableOpacity
              style={styles.seeReportButton}
              onPress={handleSeeReport}
            >
              <Text style={styles.seeReportButtonText}>See Report</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    // justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
    marginBottom: 10,
  },
  dropdownButtonStyle: {
    width: 250,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "grey",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: 250,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  seeReportButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 5,
  },
  seeReportButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#888",
  },
  chooseStoreButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  chooseStoreButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});
