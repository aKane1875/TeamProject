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
import { AddListener, createBoard } from "../../utils/helpers";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

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
	const [hexBoard, setHexBoard] = useState([]); //game board
	const mapRef = useRef(null);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		createBoard(leeds_long, leeds_lat);
		AddListener(setHexBoard);
		// findUser();
		AsyncStorage.setItem("trackerArray", JSON.stringify([]));
	}, []);

	//DECIDE WHAT HAPPENS WHEN TAP POLY
	const tappedPoly = (index) => {
		setModalVisible(true);
		const newBoard = [...hexBoard];
		const tapped = newBoard[index];
		if (auth.currentUser.uid === "NMhmZSIGbYNdjgVeCseYxRSumlN2") {
			tapped.col = "rgba(214, 102, 4, 0.3)";
		} else {
			tapped.col = "rgba(255, 66, 233, 0.3)";
		} //pale green
		tapped.current_owner = auth.currentUser.uid;
		// hexBoard[index] = tapped;
		setHexBoard(newBoard);
		updateDoc(doc(db, "gameboard", "test-board"), {
			board: newBoard,
		});
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
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Dave</Text>
						<Text style={styles.modalText}>Points: 22</Text>
						<Text style={styles.modalText}>Last activity: yesterday</Text>
						<Image
							style={styles.tinyLogo}
							source={{
								uri: "https://media4.giphy.com/media/FmaghsMLAH9DBRQDwc/giphy.gif",
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
			</Modal>
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
});
