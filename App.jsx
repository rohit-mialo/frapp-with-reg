import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginPage';
import HomeScreen from './screens/HomeScreen';
import Detection from "./screens/Detections";
import Registration from "./screens/Registration";
import FaceReg from './screens/FaceReg';
import AllUsers from './screens/Allusers';

// Create Stack Navigator and Drawer Navigator
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator Component (only shown after login)
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Detection" component={Detection} />
      <Drawer.Screen name="Registration" component={Registration} />
      <Drawer.Screen name="Allusers" component={AllUsers} />
      <Drawer.Screen name="Logout" component={LoginScreen} />
    </Drawer.Navigator>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Detection" 
            component={DrawerNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Registration" 
            component={DrawerNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FaceReg" 
            component={FaceReg} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
