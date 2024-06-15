import { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
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
      console.log(email);
      console.log(password);
      const result = await handleLogin({ variables: { email, password } });
      console.log(result);
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
        <Text style={styles.title}>WarungKu</Text>
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
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <Button title="Login" onPress={handleSubmit} />
      </View>

      <Text style={styles.register}>
        Don't have an account?{" "}
        <Link style={styles.registerLink} to={{ screen: "RegisterScreen" }}>
          Register
        </Link>
      </Text>
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
