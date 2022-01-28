import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      // console.log(auth.currentUser.uid, "uid here");
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().city_name);
        // console.log("Document data getUser:", docSnap.data());
        setUser(docSnap.data());
        // console.log(user);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    GetSingleUser();
  }, []);


  const handleSignOut = () => {
    // firebase.auth().signOut();
    signOut(auth);
  };

  const Stack = createNativeStackNavigator();

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: user.fav_colour,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Text style={styles.name}>{user.fullname}</Text>
      <View>
        <Image
          style={styles.profilePic}

          source={{
            uri: user.picture,
          }}
        />
      </View>

      <Text style={styles.text}>Current Hexagons: {user.curr_haxagons} </Text>
      <Text style={styles.text}>Total Hexagons: {user.total_hexagons}</Text>
      <Text style={styles.text}>
        Total Distance Covered: {user.total_distance}
      </Text>


      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>SIGN OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    textAlign: "right",
    alignItems: "center",
  },
  button: {
    backgroundColor: "silver",
    borderWidth: 2,
    borderColor: "black",
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "rgba(0, 0, 0 ,0)",
    shadowOffset: { width: 2, height: 2 },
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "rgba(217, 216, 208, 0.81)",
    borderWidth: 7,
  },
  name: {
    fontFamily: "serif",
    color: "white",
    fontWeight: "700",
    fontSize: 25,
    textTransform: "uppercase",
  },
  text: {
    color: "white",
    fontWeight: "500",
    fontSize: 20,
    alignSelf: "flex-start",
  },
});
