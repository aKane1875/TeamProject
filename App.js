//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import { useEffect, useState } from "react";
import AccountScreen from "./screens/signedIn/AccountScreen";
import MapScreen from "./screens/signedIn/MapScreen";
import SocialScreen from "./screens/signedIn/SocialScreen";
import { Ionicons } from "@expo/vector-icons";
import TestToolScreen from "./screens/signedIn/TestToolScreen";

import { auth } from "./Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    // firebase.auth().onAuthStateChanged(user => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, [isSignedIn]);

  if (isSignedIn == true) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={() => ({
            //headerShown: false,
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Social"
            component={SocialScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Test"
            component={TestToolScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="hammer" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="signIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
