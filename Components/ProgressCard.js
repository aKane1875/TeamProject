import hexToRgba from "hex-to-rgba";
import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const ProgressCard = ({ task }) => {
	const [progress, setProgress] = useState(Math.random()); //Math.round(Math.random() * 100)
	return (
		<View
			style={{
				padding: 15,
			}}
		>
			<Text>{task.text}</Text>
			<View
				style={{
					padding: 10,
					alignItems: "center",
				}}
			>
				<Progress.Bar progress={progress} width={300} />
			</View>
		</View>
	);
};

export default ProgressCard;
