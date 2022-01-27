import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
// import { firebase } from '../../Firebase/firebase';
import { auth } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AccountScreen = () => {
  // logs e-mail address of user, also has a displayName key (username for our app that people can create when they sign up??)
  // console.log(firebase.auth());

  // causes error when I restarted the app, need to be signed in before visiting, shoud be an easy fix
  // const fullname = auth.currentUser.displayName;
  // console.log(auth.currentUser);

  const handleSignOut = () => {
    // firebase.auth().signOut();
    signOut(auth);
  };

  const Stack = createNativeStackNavigator();

  return (
    <View>
      <Text>ACCOUNT DETAILS</Text>
      <Text>PROFILE PIC HERE</Text>
      <Text>TOTAL HEXAGONS: </Text>
      <Text>TOTAL WINS: </Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "tomato",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
