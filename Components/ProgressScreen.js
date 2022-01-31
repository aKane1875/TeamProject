import React, { useState } from "react";
import { View } from "react-native";
import ProgressCard from "./ProgressCard";

const ProgressScreen = () => {
	const taskList = [
		{ text: "Run 1km" },
		{ text: "Claim 5 hexes" },
		{ text: "Take over an rivals hex" },
		{ text: "Run for 20 minutes" },
		{ text: "Run with an average speed of 10km/h" },
	];
	const [tasks, setTasks] = useState(taskList);
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
		</View>
	);
};

export default ProgressScreen;
