import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Detection from './Detections';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FaceReg = () => {
  const route = useRoute();
  const { userData } = route.params;
  const [embedding, setEmbedding] = useState(null);

  useEffect(() => {
    storeUserData(); // Store user without embedding first
  }, []);

  const storeUserData = async (updatedEmbedding = null) => {
    try {
      const existingData = await AsyncStorage.getItem('users');
      const users = existingData ? JSON.parse(existingData) : [];

      // Find if the user already exists
      const userIndex = users.findIndex(user => user.userId === userData.userId);
      if (userIndex !== -1) {
        users[userIndex].embedding = updatedEmbedding; // Update existing user's embedding
      } else {
        users.push({ ...userData, embedding: updatedEmbedding }); // Add new user with embedding
      }

      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('User data saved successfully:', users);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const captureEmbeddings = () => {
    if (!embedding) {
      Alert.alert('Error', 'No embedding captured yet!');
      return;
    }
    storeUserData(embedding);
    Alert.alert('Success', 'Embedding captured and stored!');
  };

  return (
    <View style={styles.container}>
      <Detection userNameNew={userData} setEmbedding={setEmbedding} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.embeddingButton} onPress={captureEmbeddings}>
          <Text style={styles.embeddingText}>Capture Face</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  embeddingButton: {
    padding: 20,
    backgroundColor: '#5e17ec',
  },
  embeddingText: {
    color: '#fff',
  },
});

export default FaceReg;
