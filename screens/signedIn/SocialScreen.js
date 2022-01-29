import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";

const SocialScreen = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const GetAllData = async () => {
      const usersCol = collection(db, "user");
      const usersSnapshot = await getDocs(usersCol);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };
    GetAllData();
  }, []);
  console.log(users);

  const CONTENT = {
    tableHead: [
      "POS",
      "NAME",
      "CURRENT HEX COUNT",
      "TOTAL HEX COUNT",
      "TOTAL DISTANCE",
    ],
    tableTitle: [],
    // tableData: [
    //   ["1", "2", "3"],
    //   ["a", "b", "c"],
    //   ["1", "2", "3"],
    //   ["a", "b", "c"],
    // ],
    tableData: [],
  };

  let index = 1;
  users.forEach((user) => {
    CONTENT.tableData.push([
      user.fullname,
      user.curr_haxagons,
      user.total_hexagons,
      user.total_distance,
    ]),
      CONTENT.tableTitle.push(index);
    index++;
  });

  return (
    <View style={styles.container}>
      <ScrollView vertical={true}>
        <Text>LEADERBOARD</Text>

        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={CONTENT.tableHead}
            flexArr={[1, 1, 1, 1]}
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
