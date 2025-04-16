import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({onLogin}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation()

  const handleProceed = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name"); // Show alert
      return;
    }
    onLogin();
    navigation.navigate("Detection")
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Image source={require("../Assets/logo.png")} style={styles.logo} /> */}
        <Text style={styles.title}>
          Welcome
        </Text>

        <Text style={styles.title}>To FR App</Text>

      </View>

      <View style={styles.form}>

        <View style={styles.formSec}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            value={name}
            onChangeText={setName}

          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter your Name"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleProceed}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newreg}>
        <Text style={styles.newRegText}>Don't have an account?</Text> <TouchableOpacity ><Text style={styles.newregButton}>Register now.</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#5e17ec" },
  header: { flex: 1.5, justifyContent: "center", alignItems: "center" },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginTop: 10 },
  subtitle: { fontSize: 14, color: "#EEE" },
  form: {
    height: 380,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#AAA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  formSec: {
    marginTop: 20

  },
  rowContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    position: "absolute",
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 45,
    width: "39%"
  },
  iconStyle: {
    marginRight: 10,
    marginLeft: 10
  },
  pickerStyle: {
    flex: 1,
  },

  loginButton: {
    marginTop:10,
    backgroundColor: "#5e17ec",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  signupText: { textAlign: "center", fontSize: 14, color: "#555" },
  newreg:{width:"100%", height:60, justifyContent:"center", alignItems:"center",  flexDirection: 'row', gap:5},
  newregButton:{color:"blue"}
});

export default LoginScreen;
