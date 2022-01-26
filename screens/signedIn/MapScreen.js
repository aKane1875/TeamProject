import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tracker from "../../Components/Tracker";
import { createBoard } from "../../utils/helpers";

export default function MapScreen() {
	//this is start location only for map and also for generating grid board. Ideally not hardcoded.
	const leeds_lat = 53.7999506;
	const leeds_long = -1.5497128;

	const [userLoc, setUserLoc] = useState({
		//do we still need to track this?
		latitude: leeds_lat,
		longitude: leeds_long,
	});
	const [track, setTrack] = useState([]); //this is the path the user generates when they start playing
	const [hexBoard, setHexBoard] = useState(createBoard(leeds_long, leeds_lat)); //game board
	const mapRef = useRef(null);

	useEffect(() => {
		// findUser();
		AsyncStorage.setItem("trackerArray", JSON.stringify([]));
	}, []);

	//DECIDE WHAT HAPPENS WHEN TAP POLY
	const tappedPoly = (index) => {
		const newBoard = [...hexBoard];
		const tapped = newBoard[index];
		tapped.col = "rgba(42, 181, 0, 0.5)"; //pale green
		newBoard[index] = tapped;
		setHexBoard(newBoard);
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
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: userLoc.latitude,
					longitude: userLoc.longitude,
					latitudeDelta: 0.009, //is inital zoom level right? maybe zoom out to see board
					longitudeDelta: 0.009,
				}}
				showsUserLocation={true}
				showsMyLocationButton={true}
				followsUserLocation={true} //is this working now region is not set? if so, maybe manage in state
			>
				{hexBoard.map((poly, index) => (
					<Polygon
						key={index}
						coordinates={poly.coords}
						strokeColor="rgba(0,0,0,0.1)"
						fillColor={poly.col}
						strokeWidth={1}
						tappable
						onPress={() => tappedPoly(index)}
					/>
				))}
				{track.length > 1 ? (
					<Polyline
						coordinates={track}
						strokeColor="rgb(229, 0, 0)" //red
						fillColor="rgba(229, 0, 0, 0.2)" //red
						strokeWidth={3}
					/>
				) : null}
			</MapView>
			<Text>
				Path Points: {track.length} hex count: {hexBoard.length}{" "}
			</Text>
			<Tracker
				setTrack={setTrack}
				track={track}
				hexBoard={hexBoard}
				setHexBoard={setHexBoard}
			/>
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
});
