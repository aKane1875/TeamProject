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

const TotalHex = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const GetAllData = async () => {
      const usersCol = collection(db, "user");
      //change order by
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      const q = query(usersCol, orderBy("total_hexagons", "desc"), limit(25));
      const usersSnapshot = await getDocs(q);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };
    GetAllData();
  }, []);

  const CONTENT = {
    tableHead: [
      "Position",
      "Player",
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //"CURRENT HEX COUNT",
      "Hexagons",
      //"TOTAL DISTANCE",
    ],
    tableTitle: [],

    tableData: [],
  };

  let index = 1;
  users.forEach((user) => {
    CONTENT.tableData.push([
      user.fullname,
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //user.curr_hexagons,
      user.total_hexagons,
      //user.total_distance,
    ]),
      CONTENT.tableTitle.push(index);
    index++;
  });

  return (
    <View style={styles.container}>
      {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
      <Text style={styles.titleOfTable}>Total Hexagons</Text>

      <ScrollView vertical={true}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row
            data={CONTENT.tableHead}
            flexArr={[2, 3, 3]}
            style={styles.head}
            textStyle={styles.headText}
          />
          <TableWrapper style={styles.wrapper}>
            <Col
              data={CONTENT.tableTitle}
              style={styles.title}
              //heightArr={[28, 28]}
              textStyle={styles.text}
            />
            <Rows
              data={CONTENT.tableData}
              flexArr={[1, 1, 1]}
              style={styles.row}
              textStyle={styles.text}
            />
          </TableWrapper>
        </Table>
      </ScrollView>
    </View>
  );
};

export default TotalHex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  titleOfTable: {
    textAlign: "center",
    color: "tomato",
    fontWeight: "bold",
  },
  head: {
    backgroundColor: "tomato",
  },
  headText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    lineHeight: 30,
  },
  wrapper: {
    flexDirection: "row",
  },
  // title: { flex: 1 },
  row: {
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "center",
    color: "tomato",
    fontWeight: "bold",
    lineHeight: 20,
  },
});
