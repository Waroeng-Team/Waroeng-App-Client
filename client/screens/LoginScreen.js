import { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { Link } from "@react-navigation/native";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handleLogin, { data, loading, error }] = useMutation(LOGIN);

  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  async function handleSubmit() {
    try {
      // console.log(email);
      // console.log(password);
      const result = await handleLogin({ variables: { email, password } });
      // console.log(result);
      //save token in SecureStore
      await SecureStore.setItemAsync(
        "access_token",
        result.data.login.access_token
      );
      setIsSignedIn(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={{ marginBottom: 10 }}>
          <Image
            style={{
              width: "100%",
              height: 60,
              alignSelf: "center",
              resizeMode: "cover",
            }}
            source={{
              uri: "https://res.cloudinary.com/djeteqtzh/image/upload/fl_preserve_transparency/v1718816482/Logo_wbipar.jpg?_s=public-apps",
            }}
          />
          <Text style={{fontWeight:"bold", alignSelf: "center", fontSize:30}}>Masuk</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          style={styles.input}
          placeholder="Kata sandi"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <TouchableOpacity
          style={{ backgroundColor: "#ffa500", borderRadius: 5 }}
          onPress={handleSubmit}
        >
          <Text
            style={{
              alignSelf: "center",
              paddingBottom: 10,
              paddingTop: 10,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Masuk
          </Text>
        </TouchableOpacity>
        {/* <Button title="Login" onPress={handleSubmit} /> */}
      </View>

      <Text>
        Belum punya akun?{" "}
        <Link style={styles.registerLink} to={{ screen: "RegisterScreen" }}>
          Daftar
        </Link>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
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
  registerLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
