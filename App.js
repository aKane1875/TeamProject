//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox } from "react-native";
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
import ResetPassword from "./screens/ResetPassword";
import StatsScreen from "./screens/signedIn/StatsScreen";

//global vars
globalHexBoard = [];
globalColour = "";
board_name = "YORKTEST";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer"]);
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
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
          />
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

          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart" color={color} size={size} />
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
          <Stack.Screen
            name="resetPassword"
            component={ResetPassword}
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
