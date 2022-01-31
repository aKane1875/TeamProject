import React, { useState } from "react";
import { View } from "react-native";
import ProgressCard from "./ProgressCard";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

const ProgressScreen = () => {
	const [progressData, setProgressData] = useState([]);

	useEffect(() => {
		const GetProgressData = async () => {
			const docRef = doc(db, "user", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			// console.log(auth.currentUser.uid, "uid here");
			if (docSnap.exists()) {
				// console.log("Document data:", docSnap.data().city_name);
				// console.log("Document data getUser:", docSnap.data());
				setProgressData(docSnap.data());
				// console.log(user);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		};
		GetProgressData();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "column",
			}}
		>
			<ProgressCard task={tasks[0]} />
			<ProgressCard task={tasks[1]} />
			<ProgressCard task={tasks[2]} />
			<ProgressCard task={tasks[3]} />
			<ProgressCard task={tasks[4]} />
			<ProgressCard task={tasks[5]} />
			<ProgressCard task={tasks[6]} />
			<ProgressCard task={tasks[7]} />
		</View>
	);
};

export default ProgressScreen;
