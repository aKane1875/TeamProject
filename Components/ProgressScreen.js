import React, { useState } from "react";
import { View } from "react-native";
import ProgressCard from "./ProgressCard";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

const ProgressScreen = () => {
	const [progressData, setProgressData] = useState([]);

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
