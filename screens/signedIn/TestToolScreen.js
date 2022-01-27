import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
//import { firebase } from '../../Firebase/firebase';

import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

const TestToolScreen = () => {
	const GetSingleItem = async () => {
		const docRef = doc(db, "gameboard", "test-board");
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document data:", docSnap.data().city_name);
			console.log("Document data:", docSnap.data().board[0].col);
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	};

	const GetAllData = async () => {
		const citiesCol = collection(db, "gameboard");
		const citySnapshot = await getDocs(citiesCol);
		const cityList = citySnapshot.docs.map((doc) => doc.data());
		console.log(cityList);
	};

	const AddData = async () => {
		const city = "Glasgow";
		await setDoc(doc(db, "gameboard", "leeds-board"), {
			city_name: city,
		});
		//Add a new document in collection "users"
	};

	return (
		<View style={styles.container}>
			<Text>Tools</Text>

			<TouchableOpacity onPress={GetSingleItem} style={styles.button}>
				<Text style={styles.buttonText}>GET ONE BIT OF DATA</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={GetAllData} style={styles.button}>
				<Text style={styles.buttonText}>GET DATA FROM FIREBASE</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={AddData} style={styles.button}>
				<Text style={styles.buttonText}>ADD DATA TO FIREBASE</Text>
			</TouchableOpacity>
		</View>
	);
};

export default TestToolScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		backgroundColor: "tomato",
		width: "60%",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 40,
	},
	buttonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
});
