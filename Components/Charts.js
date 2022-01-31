import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { ButtonGroup } from "react-native-elements";
import ChartCard from "./ChartCard";

const Charts = () => {
	const data = [
		[
			{ x: "1", y: 2 },
			{ x: "2", y: 3 },
			{ x: "3", y: 5 },
		],
		[
			{ x: "1", y: 2 },
			{ x: "2", y: 3 },
			{ x: "3", y: 5 },
			{ x: "4", y: 4 },
			{ x: "5", y: 7 },
			{ x: "6", y: 5 },
			{ x: "7", y: 6 },
			{ x: "8", y: 3 },
			{ x: "9", y: 6 },
			{ x: "10", y: 2 },
		],
		[
			{ x: "1", y: 2 },
			{ x: "2", y: 3 },
			{ x: "3", y: 5 },
			{ x: "4", y: 4 },
			{ x: "5", y: 7 },
			{ x: "6", y: 5 },
			{ x: "7", y: 6 },
			{ x: "8", y: 3 },
			{ x: "9", y: 6 },
			{ x: "10", y: 2 },
			{ x: "11", y: 10 },
			{ x: "12", y: 7 },
			{ x: "13", y: 8 },
			{ x: "14", y: 6 },
			{ x: "15", y: 7 },
			{ x: "16", y: 8 },
			{ x: "17", y: 6 },
			{ x: "18", y: 8 },
			{ x: "19", y: 6 },
			{ x: "20", y: 4 },
		],
	];
	const [runData, setRunData] = useState(data[0]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "column",
			}}
		>
			<View
				style={{
					flex: 1,
					flexDirection: "column",
					padding: 10,
					// borderWidth: 5,
					// borderColor: "rgba(245, 66, 105, 1)",
				}}
			>
				<ChartCard title={"Distance"} runData={runData} />
				<ChartCard title={"Time"} runData={runData} />
				<ChartCard title={"Speed"} runData={runData} />
			</View>
			<ButtonGroup
				buttons={["WEEK", "MONTH", "YEAR"]}
				selectedIndex={selectedIndex}
				onPress={(value) => {
					setSelectedIndex(value);
					setRunData(data[value]);
				}}
				containerStyle={{ marginBottom: 20 }}
			></ButtonGroup>
		</View>
	);
};

export default Charts;
