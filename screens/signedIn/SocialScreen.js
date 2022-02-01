import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import {
	Table,
	TableWrapper,
	Row,
	Rows,
	Col,
} from "react-native-table-component";
import DropDownPicker from "react-native-dropdown-picker";

// HOW IT WAS BEING CALLED FOR REF.

// const SocialScreen = () => {
//   const [users, setUsers] = useState([]);
//   useEffect(() => {
//     const GetAllData = async () => {
//       const usersCol = collection(db, "user");
//       const q = query(usersCol, orderBy("total_hexagons", "desc"), limit(10));
//       const usersSnapshot = await getDocs(q);
//       const usersList = usersSnapshot.docs.map((doc) => doc.data());
//       setUsers(usersList);
//     };
//     GetAllData();
//   }, []);

// ATTEMPT TO ADD A DROP DOWN BUTTON TO SORT BY
const SocialScreen = () => {
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("curr_hexagons");
	const [items, setItems] = useState([
		{ label: "Total Hexagons", value: "total_hexagons" },
		{ label: "Total Distance", value: "total_distance" },
		{ label: "Current Hexagons", value: "curr_hexagons" },
	]);

	useEffect(() => {
		const GetAllData = async () => {
			const usersCol = collection(db, "user");
			const q = query(usersCol, orderBy(value, "desc"), limit(10));
			const usersSnapshot = await getDocs(q);
			const usersList = usersSnapshot.docs.map((doc) => doc.data());
			setUsers(usersList);
		};
		GetAllData();
	}, [value]);

	// console.log(users);

	const CONTENT = {
		tableHead: [
			"POS",
			"NAME",
			"CURRENT HEX COUNT",
			"TOTAL HEX COUNT",
			"TOTAL DISTANCE",
		],
		tableTitle: [],

		tableData: [],
	};

	let index = 1;
	users.forEach((user) => {
		CONTENT.tableData.push([
			user.fullname,
			user.curr_hexagons,
			user.total_hexagons,
			user.total_distance,
		]),
			CONTENT.tableTitle.push(index);
		index++;
	});

	return (
		<View style={styles.container}>
			<Text>LEADERBOARD</Text>

			<DropDownPicker
				name={"sort by"}
				setValue={setValue}
				open={open}
				items={items}
				value={value}
				setOpen={setOpen}
			/>

			<ScrollView vertical={true}>
				<Table borderStyle={{ borderWidth: 1 }}>
					<Row
						data={CONTENT.tableHead}
						flexArr={[1, 2, 1, 1, 1]}
						style={styles.head}
						textStyle={styles.text}
					/>
					<TableWrapper style={styles.wrapper}>
						<Col
							data={CONTENT.tableTitle}
							style={styles.title}
							heightArr={[28, 28]}
							textStyle={styles.text}
						/>
						<Rows
							data={CONTENT.tableData}
							flexArr={[2, 1, 1, 1]}
							style={styles.row}
							textStyle={styles.text}
						/>
					</TableWrapper>
				</Table>
			</ScrollView>
		</View>
	);
};

export default SocialScreen;

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, paddingTop: 100, backgroundColor: "#fff" },
	head: { backgroundColor: "orange" },
	wrapper: { flexDirection: "row" },
	title: { flex: 1 },
	row: { height: 28 },
	text: { textAlign: "center" },
});
