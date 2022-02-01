import { Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";
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
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    GetSingleUser();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  //https://docs.expo.dev/versions/latest/sdk/sharing/
  const shareMessage = () => {
    //Here is the Share API
    Share.share({
      message:
     `Check out my stats on Hex-Run
      I currently own ${user.curr_hexagons} hexagons.
      I have collected ${user.total_hexagons} in total.
      I have run for ${user.total_distance}km 
      I have played for ${user.total_playtime} minutes`,
    })
      //after successful share return result
      .then((result) => console.log(result))
      //If any thing goes wrong it comes here
      .catch((errorMsg) => console.log(errorMsg));
  };

  return (


      <View
        style={styles.container}
      // {{flex: 1,
      //   backgroundColor: user.fav_colour,
      //   justifyContent: "space-around",
      //   alignItems: "center",}}
      >
        <Text style={
             {
              color: user.fav_colour,
              fontSize: 40,
              fontWeight: "bold",
              marginBottom: 10,
              marginTop: 10,
            }
        }>{user.fullname}</Text>
        <View>
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderColor: user.fav_colour,
              borderWidth: 7,

            }}
            source={{ uri: user.picture }}
          />
        </View>

        <View style={styles.TextContainer}>

          <Text style={styles.text}>Current Hexagons: {user.curr_hexagons} </Text>
          <Text style={styles.text}>Total Hexagons: {user.total_hexagons}</Text>
          <Text style={styles.text}>Total Distance Covered: {user.total_distance} km</Text>
          <Text style={styles.text}>Total Playtime: {user.total_playtime} minutes</Text>

          {/* <Text style={styles.text}>Most Recent Run: {user.runs.slice(-1).start_time} </Text> */}

        </View>
        <TouchableOpacity onPress={shareMessage} style={styles.button}>
          <Text style={styles.buttonText}>Share your stats</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "tomato",
    width: "90%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 0
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  // profilePic: {
  //   width: 200,
  //   height: 200,
  //   borderRadius: 100,
  //   borderColor: "rgba(217, 216, 208, 0.81)",
  //   borderWidth: 7,
  // },
  // name: {
  //   // color: user.fav_colour,
  //   fontWeight: "700",
  //   fontSize: 25,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   marginTop: 20,
  //   // textTransform: "uppercase",
  // },
  TextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",

  },
  text: {
    marginLeft: 0,
    marginTop: 5,
    color: "tomato",
    fontWeight: "500",
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
