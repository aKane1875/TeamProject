import AsyncStorage from "@react-native-async-storage/async-storage";
import hexGrid from "@turf/hex-grid";
import isPointInPolygon from "geolib/es/isPointInPolygon";
import * as Location from "expo-location";
import { db } from "../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore/lite";

//GETS POINTS STORED BY THE TASK MANAGER IN LOCAL AsycnStorage, ADDS IT NEW
// POINT TO IT AND THEN PPUTS IT BACK IN STORAGE
export const updateTrackerArray = async (newValue) => {
  try {
    let jsonValue = await AsyncStorage.getItem("trackerArray");
    const parsedArray = jsonValue != null ? JSON.parse(jsonValue) : null;
    const newArray = [...parsedArray, newValue];
    jsonValue = JSON.stringify(newArray);
    await AsyncStorage.setItem("trackerArray", jsonValue);
  } catch (e) {
    console.log("update tracker array error", e);
  }
};

//GENERATE THE GAME BOARD
export const createBoard = (_lon, _lat) => {
  const board_size = 0.01;
  const board_h = board_size * 2; //can change this 2 value to adjust for a more square board
  const bbox = [
    _lon - board_h,
    _lat - board_size,
    _lon + board_h,
    _lat + board_size,
  ];

  //CREATE HEX GRID
  const cellSide = 0.12; //higher number means fewer, bigger hexes. porbably improves performance
  const options = { units: "kilometres" };
  const grid = hexGrid(bbox, cellSide, options);

  //EXTRACT JUST COORDINATES FROM HEX DATA - REMOVE ALL THE GEOJSON STUFF
  const board = grid.features.map((feature) => feature.geometry.coordinates[0]);

  //CONVERT THE ARRAYS TO OBJECTS THAT MAPVIEW CAN READ
  board.forEach((poly, index) => {
    const _coords = poly.map((coordArr) => {
      //creates an array of coord objects for each point of the hex
      return {
        longitude: coordArr[0],
        latitude: coordArr[1],
      };
    });

    board[index] = {
      //this is the object for each hex, includes the coords arry above as a proprty. Add any properties here that each will have, eg owner, team, etc
      col: "rgba(3, 90, 252, 0.4)",
      coords: _coords,
    };
  });
  AddData(board);
  return board;
};

export const AddData = async (board) => {
  await setDoc(doc(db, "gameboard", "leeds-board"), {
    board,
  });
  //Add a new document in collection "users"
};

//USE THIS IS CHECK IF USERS POSITION OR WHOLE PATH IS INSIDE ANY OF THE HEXES.
export const checkPathIsInPolys = (pointsArray, hexArray, setHexBoard) => {
  const newArray = [...hexArray];

  pointsArray.forEach((point) => {
    for (const hex of newArray) {
      if (isPointInPolygon(point, hex.coords)) {
        //put stuff here if you want it to happen if a point is inside a hex. Can refer to the hex directly using "hex"
        hex.col = "rgba(235, 210, 52, 0.3)"; //yellow
        break;
      }
    }
  });
  setHexBoard(newArray);
};

//FIND USERS CURRENT POSITION ONCE. MIGHT NOT NEED NOW USING BACKGROUND TRACKER?
export const findUser = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  } else {
    console.log("Permission to access location granted");
  }

  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    enableHighAccuracy: true,
    timeInterval: 5000,
    distanceInterval: 0,
  });

  setUserLoc({
    //does this function need to be a paramater?
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  });
};
