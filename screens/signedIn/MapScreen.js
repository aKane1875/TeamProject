import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Modal,
  Pressable,
  Image,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tracker from "../../Components/Tracker";
import { AddListener, createBoard, GetColour } from "../../utils/helpers";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import nightview from "../../mapstyles/nightview";
import silverview from "../../mapstyles/silverview";
import * as Location from "expo-location";

export default function MapScreen() {
  //this is start location only for map and also for generating grid board. Ideally not hardcoded.
  // const leeds_lat = 53.7999506;
  // const leeds_long = -1.5497128;

  const leeds_lat = 53.95983643845927;
  const leeds_long = -1.0797423411577778;

  const [userLoc, setUserLoc] = useState({
    //do we still need to track this?
    latitude: leeds_lat,
    longitude: leeds_long,
  });
  const [track, setTrack] = useState([]); //this is the path the user generates when they start playing
  const [hexBoard, setHexBoard] = useState([]); //game board
  const mapRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [runData, setRunData] = useState(null);
  const [user, setUser] = useState({});
  const [userID, setUserId] = useState("");
  let mapstyle = silverview;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLoc(location);
      console.log("location on map screen: ", location);
      createBoard(location.coords.longitude, location.coords.latitude);
      AddListener(setHexBoard);
      GetColour();
      // findUser();
      AsyncStorage.setItem("trackerArray", JSON.stringify([]));
    })();
  }, []);

  useEffect(() => {
    const GetSingleUser = async () => {
      if (userID.length > 0) {
        const docRef = doc(db, "user", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    };
    GetSingleUser();
  }, [userID]);

  const tappedPoly = (index) => {
    const tapped = hexBoard;
    tapped.current_owner = auth.currentUser.uid;
    setUserId(tapped.current_owner);
    setModalVisible(true);
  };

  const panToUser = async () => {
    findUser();
    mapRef.current.animateCamera({
      center: userLoc,
    });
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        style={{ flex: 1, margin: 1 }}
        customMapStyle={mapstyle}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: leeds_lat,
          longitude: leeds_long,
          latitudeDelta: 0.03, //is inital zoom level right? 0.009
          longitudeDelta: 0.03,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true} //is this working now region is not set? if so, maybe manage in state
      >
        {hexBoard.length > 0
          ? hexBoard.map((poly, index) => (
              <Polygon
                key={index}
                coordinates={poly.coords}
                strokeColor="rgba(0,0,0,0.1)"
                fillColor={poly.col}
                strokeWidth={1}
                tappable
                onPress={() => tappedPoly(index)}
              />
            ))
          : null}
        {track.length > 1 ? (
          <Polyline
            coordinates={track}
            strokeColor="rgb(229, 0, 0)" //red
            fillColor="rgba(229, 0, 0, 0.2)" //red
            strokeWidth={3}
          />
        ) : null}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        {runData !== null ? (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>NICE RUN!</Text>
              <Text style={styles.modalText}>
                Distance: {runData.distance / 1000}km
              </Text>
              <Text style={styles.modalText}>Time: {runData.duration}</Text>
              <Text style={styles.modalText}>
                Average Speed: {runData.speed}km/h
              </Text>
              <Text style={styles.modalText}>
                Hexes Claimed: {runData.nuetralHexes}
              </Text>
              <Text style={styles.modalText}>
                Rival Hexes Captured: {runData.enemyHexes}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setRunData(null);
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{user.fullname}</Text>
              <Text style={styles.modalText}>
                Current hexagons: {user.curr_haxagons}
              </Text>
              <Text style={styles.modalText}>
                Total Hexagons: {user.total_hexagons}
              </Text>
              <Text style={styles.modalText}>
                {" "}
                Total distance: {user.total_distance}
              </Text>

              <Image
                style={styles.tinyLogo}
                source={{
                  uri: user.picture,
                }}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Screen</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
      <Text>
        Path Points: {track.length} hex count: {hexBoard.length}{" "}
      </Text>
      {globalHexBoard ? (
        <Tracker
          setTrack={setTrack}
          track={track}
          setRunData={setRunData}
          setModalVisible={setModalVisible}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 200,
    height: 200,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  tinyLogo: {
    width: 190,
    height: 190,
    borderRadius: 30,
    margin: 10,
  },
});
