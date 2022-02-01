import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { checkPathIsInPolys, updateTrackerArray } from "../utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../Firebase/firebase";
import { getPathLength, isPointInPolygon } from "geolib";
import {
	arrayUnion,
	doc,
	increment,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import hexToRgba from "hex-to-rgba";
import dayjs from "dayjs";
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
const LOCATION_TRACKING = "location-tracking";

function Tracker({ setTrack, track, setRunData, setModalVisible }) {
	const [locationStarted, setLocationStarted] = useState(false);
	const [startTime, setStartTime] = useState("");
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
		setStartTime(dayjs());
		console.log("start time SET", startTime);
		currentHex = -1;
		nuetralHexes = 0;
		enemyHexes = 0;
		enemiesToNotify = [];
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

	const levelUpCheck = (task, stat, perGame) => {
		let count = 0;
		task.progress = task.progress + stat;
		while (task.progress >= task.goal) {
			(task.goal = Math.ceil(task.goal * 1.1)), task.level++;
			count++;
		}
		if (perGame) {
			task.progress = 0;
		}
		return count;
	};

	//Start tracker
	const startLocation = () => {
		startLocationTracking();
	};

	//stop tracker
	const stopLocation = async () => {
		getStoredTrackerData();
		clearInterval(updateTrackInterval);
		setLocationStarted(false);
		const endTime = dayjs();
		const runDist = getPathLength(track);
		const runTime = endTime.diff(startTime);
		const userRef = doc(db, "user", auth.currentUser.uid);
		const docSnap = await getDoc(userRef);
		if (docSnap.exists()) {
			//updates achievements
			const tasks = docSnap.data().tasks;
			let goalsHit = 0;
			goalsHit += levelUpCheck(tasks[0], 1, false);
			goalsHit += levelUpCheck(tasks[1], runDist, true);
			goalsHit += levelUpCheck(tasks[2], runDist, false);
			goalsHit += levelUpCheck(tasks[3], claimedHexes, true);
			goalsHit += levelUpCheck(tasks[3], claimedHexes, false);
			goalsHit += levelUpCheck(tasks[4], runTime / 1000 / 60, true);
			goalsHit += levelUpCheck(tasks[4], runTime / 1000 / 60, false);

			await updateDoc(userRef, {
				total_distance: docSnap.data().total_distance + runDist,
				total_hexagons: docSnap.data().total_hexagons + claimedHexes,
				total_playtime: docSnap.data().total_playtime + runTime,
				number_of_completed_runs: docSnap.data().number_of_completed_runs + 1,
				tasks: tasks,
			});

			await updateDoc(userRef, {
				runs: arrayUnion({
					start_time: startTime.toString(),
					run_duration: runTime,
					distance: runDist,
					speed: runDist / runTime,
					route: track,
				}),
			});
		} else {
			console.log("No such document!");
		}

		const _dist =
			runDist < 1000
				? runDist + " metres"
				: Number(runDist / 1000).toFixed(1) + " km";

		setRunData({
			start_time: startTime,
			duration: dayjs.duration(runTime).format("H:mm:ss"),
			distance: runDist / 1000,
			speed: runDist / 1000 / Number(dayjs.duration(runTime).asHours()),
			// route: track,
			claimedHexes: claimedHexes,
		});
		setModalVisible(true);
		setTrack([]);
		currentHex = -1;
		claimedHexes = 0;
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
		updateTrackerArray(newPoint);
		updateHexOwnerBackend(newPoint);
	}
});

var currentHex = -1;
var claimedHexes = 0;

const updateHexOwnerBackend = async (newPoint) => {
	// console.log("auth.currentUser.uid: ", auth.currentUser.uid);
	// console.log("globalColour: ", globalColour);
	for (let i = 0; i < globalHexBoard.length; i++) {
		const hex = globalHexBoard[i];
		if (isPointInPolygon(newPoint, hex.coords)) {
			if (currentHex !== i) {
				//only claim hex if it is not tile currently standing in
				claimedHexes++;
				hex.current_owner = auth.currentUser.uid;
				hex.col = hexToRgba(globalColour, 0.6);
				currentHex = i;
				await setDoc(doc(db, "gameboard", board_name), {
					board: globalHexBoard,
				});
				break;
			}
			//put stuff here if you want it to happen if a point is inside a hex. Can refer to the hex directly using "hex"
		}
	}
};

export default Tracker;
