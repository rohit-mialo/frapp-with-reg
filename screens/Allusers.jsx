import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const storedUsers = await AsyncStorage.getItem('users');
          if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
            console.log(storedUsers)
          }
        } catch (error) {
          console.error('Error retrieving users:', error);
        }
      };

      fetchUsers();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Users</Text>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userText}>Name: {item.userName}</Text>
              <Text style={styles.userText}>User ID: {item.userId}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
              <Text style={styles.userText}>Phone: {item.phone}</Text>
              <Text style={styles.embeddingText}>
                Face Embedding: {item.embedding ? 'Captured ✅' : 'Not Captured ❌'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noUsersText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // For shadow effect
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
  embeddingText: {
    fontSize: 16,
    color: item => (item.embedding ? 'green' : 'red'), // Dynamic color for embedding status
  },
});

export default AllUsers;
