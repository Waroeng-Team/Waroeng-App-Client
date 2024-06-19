import { gql, useMutation } from "@apollo/client";
import { Link } from "@react-navigation/native";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";

const REGISTER = gql`
  mutation Register($name: String, $email: String, $password: String) {
    register(name: $name, email: $email, password: $password) {
      _id
      email
      isNewAccount
      name
      password
    }
  }
`;

export default function RegisterScreen({ navigation }) {
  const [handleRegister, { data, loading, error }] = useMutation(REGISTER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await handleRegister({
        variables: { name, email, password },
      });
      // console.log(result);
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
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
        </View>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            fontSize: 30,
            marginBottom: 10,
          }}
        >
          Daftar
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Kata Sandi"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#ffa500",
            borderRadius: 5,
            marginBottom: 10,
          }}
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
            Daftar
          </Text>
        </TouchableOpacity>
        {/* <Button title="Sign Up" onPress={handleSubmit} /> */}
      </View>
      <Text>
        Sudah punya akun?{" "}
        <Link style={styles.loginLink} to={{ screen: "LoginScreen" }}>
          Masuk
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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
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
  loginLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
