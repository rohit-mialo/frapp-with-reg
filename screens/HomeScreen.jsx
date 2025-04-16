import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Detection from "./Detections"

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
     <Detection/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"red"
  },

});

export default HomeScreen;
