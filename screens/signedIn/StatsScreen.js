import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProgressScreen from "../../Components/ProgressScreen";
import Charts from "../../Components/Charts";

// function ChartScreen() {
// 	return (
// 		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// 			<Text>Settings!</Text>
// 		</View>
// 	);
// }

const Tab = createMaterialTopTabNavigator();

export default function StatsScreen() {
	return (
		// <NavigationContainer>
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
				tabBarLabelStyle: { fontSize: 16, fontWeight:"bold" },
				tabBarStyle: { backgroundColor: 'white' },
			}}
		>
			<Tab.Screen name="Achievements" component={ProgressScreen} />
			<Tab.Screen name="Statistics" component={Charts} />
		</Tab.Navigator>
		// </NavigationContainer>
	);
}
