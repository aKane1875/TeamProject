import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { checkPathIsInPolys, updateTrackerArray } from "../utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_TRACKING = "location-tracking";

function Tracker({ setTrack, track, hexBoard, setHexBoard }) {
  const [locationStarted, setLocationStarted] = useState(false);

  let updateTrackInterval;

  //Function to begin the tracker function running
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: "App Name",
        notificationBody: "Location is used when App is in background",
      },
      activityType: Location.ActivityType.Fitness,
      showsBackgroundLocationIndicator: true,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    updateTrackInterval = setInterval(() => {
      getStoredTrackerData();
    }, 2000); //change this number to set how often local memory is checked to update route on screen
    console.log("tracking started?", hasStarted);
  };

  //ask permissions on component mount
  useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };
    config();
  }, []);

  //Start tracker
  const startLocation = () => {
    startLocationTracking();
  };

  //stop tracker
  const stopLocation = () => {
    getStoredTrackerData();
    clearInterval(updateTrackInterval);
    setLocationStarted(false);
    checkPathIsInPolys(track, hexBoard, setHexBoard);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        console.log("tracking Stopped");
      }
    });
  };

  //collect data stored by tracker, put it in state, clear local storage
  const getStoredTrackerData = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem("trackerArray");
      if (jsonValue) {
        const parsedArray = JSON.parse(jsonValue);
        setTrack((currTrack) => [...currTrack, ...parsedArray]);
        await AsyncStorage.removeItem("trackerArray");
      }
      //DELETE THIS IF TRACKING WORKS
      // const parsedArray = jsonValue != null ? JSON.parse(jsonValue) : null;
      // jsonValue = JSON.stringify([]);
      // await AsyncStorage.setItem("trackerArray", jsonValue);
    } catch (e) {
      console.log("error in get stored tracker data", e);
    }
  };

  return (
    <View>
      {locationStarted ? (
        <Button title="STOP" onPress={stopLocation} />
      ) : (
        <Button title="START" onPress={startLocation} />
      )}
    </View>
  );
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING TASK ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const newPoint = {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    };
    // console.log("Tracker found new point", newPoint);
    updateTrackerArray(newPoint);
  }
});

export default Tracker;
