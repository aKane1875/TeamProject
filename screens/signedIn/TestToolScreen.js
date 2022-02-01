import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Share,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
// import ProgressBar from 'react-native-progress/Bar';
import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const TestToolScreen = () => {
	const [inputValue, setInputValue] = useState("");
	const [user, setUser] = useState({});

	useEffect(() => {
		const GetDeets = async () => {
			const docRef = doc(db, "user", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setUser(docSnap.data());
				console.log(docSnap.data());
			} else {
				console.log("No such document!");
			}
		};
		GetDeets();
	}, []);

	//https://docs.expo.dev/versions/latest/sdk/sharing/
	const shareMessage = () => {
		//Here is the Share API
		Share.share({
			message: inputValue.toString(),
		})
			//after successful share return result
			.then((result) => console.log(result))
			//If any thing goes wrong it comes here
			.catch((errorMsg) => console.log(errorMsg));
	};

	return (
		<View style={styles.container}>
			<TextInput
				value={inputValue}
				onChangeText={(inputValue) => setInputValue(inputValue)}
				placeholder={"Enter Text to Share"}
				style={styles.textInput}
			/>
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.button}
				onPress={shareMessage}
			>
				<Text style={styles.buttonText}>Share Input Text</Text>
			</TouchableOpacity>
			{/* 
				<Text>Collect 10 Hexagons:</Text>
				<ProgressBar progress={user.total_hexagons / 10} width={200} height={10} color="rgba(0, 122, 255, 1)" /> */}

			{/* <Text>Collect 10 Hexagons:</Text>
				<ProgressBar progress={user.total_hexagons / 10} width={200} height={10} color={user.fav_colour} />
				<Text>Collect 100 Hexagons:</Text>
				<ProgressBar progress={user.total_hexagons / 100} width={200} height={10} color={user.fav_colour} />
				<Text>Collect 1000 Hexagons:</Text>
				<ProgressBar progress={user.total_hexagons / 1000} width={200} height={10} color={user.fav_colour} />
				<Text>Run 10 Kilometers:</Text>
				<ProgressBar progress={user.total_distance / 10} width={200} height={10} color={user.fav_colour} />
				<Text>Run 100 Kilometers:</Text>
				<ProgressBar progress={user.total_distance / 100} width={200} height={10} color={user.fav_colour} />
				<Text>Run for 10 minutes:</Text>
				<ProgressBar progress={user.total_playtime / 10} width={200} height={10} color={user.fav_colour} />
				<Text>Run for 100 minutes:</Text>
				<ProgressBar progress={user.total_playtime / 100} width={200} height={10} color={user.fav_colour} /> */}
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
	titleTextsmall: {
		marginVertical: 8,
		fontSize: 16,
	},
	textInput: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		width: "90%",
		paddingHorizontal: 10,
	},
});
