import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
// import { firebase } from '../../Firebase/firebase';
import { auth, db } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { doc, getDoc } from "firebase/firestore";

const AccountScreen = () => {
  // logs e-mail address of user, also has a displayName key (username for our app that people can create when they sign up??)
  // console.log(firebase.auth());
  const [user, setUser] = useState({});

  useEffect(() => {
    const GetSingleUser = async () => {
      const docRef = doc(db, "user", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().city_name);
        console.log("Document data:", docSnap.data());
        setUser(docSnap.data());
        // console.log(user);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    GetSingleUser();
  }, []);

  // logs e-mail address of user, also has a displayName key (username for our app that people can create when they sign up??)
  // console.log(firebase.auth());

  // causes error when I restarted the app, need to be signed in before visiting, shoud be an easy fix
  // const fullname = auth.currentUser.displayName;
  //   console.log(auth.currentUser);

  const handleSignOut = () => {
    // firebase.auth().signOut();
    signOut(auth);
  };

  const Stack = createNativeStackNavigator();

  return (
    <View>
      <Text>{user.fullname}ACCOUNT DETAILS</Text>
      <Text>PROFILE PIC HERE</Text>
      <Text>TOTAL HEXAGONS: </Text>
      <Text>TOTAL WINS: </Text>

      {/* <TouchableOpacity onPress={GetSingleUser} style={styles.button}>
				<Text style={styles.buttonText}>Get user data</Text>
			</TouchableOpacity> */}

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
    backgroundColor: "rgba(141, 17, 190, 0.94)",
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
    marginTop: 10,
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
