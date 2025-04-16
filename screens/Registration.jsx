import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { center } from '@shopify/react-native-skia';
const Registration = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation()

  const handleSubmit = () => {
    const userData={
      userName,
      userId,
      email,
      phone
    }
    navigation.navigate("FaceReg", {userData})
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>User Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          placeholderTextColor="#A9A9A9"
        />

        <TextInput
          style={styles.input}
          placeholder="User Id"
          value={userId}
          onChangeText={setUserId}
          placeholderTextColor="#A9A9A9"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#A9A9A9"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#A9A9A9"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 50,
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Soft background color
    padding: 20,
  },
  form: {
    width: "100%",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#5e17ec', // Green color for the button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
  linkText: {
    fontSize: 14,
    color: '#4CAF50', // Green color for the link
    fontWeight: 'bold',
  },
});

export default Registration;
