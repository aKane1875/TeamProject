import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { auth, db } from "../Firebase/firebase";
import ProgressCard from "./ProgressCard";

const ProgressScreen = () => {
  const [taskList, setTaskList] = useState([]);
  const taskText = [
    ["Play ", " games"],
    ["Run ", "km in a game"],
    ["Run ", "km in total"],
    ["Claim ", " hexes in a game"],
    ["Claim ", " hexes in total"],
    ["Run for ", " minutes in a game"],
    ["Run for ", " minutes in total"],
  ];

  useEffect(() => {
    const GetProgress = async () => {
      const userRef = doc(db, "user", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setTaskList(docSnap.data().tasks);
      } else {
        console.log("No such document!");
      }
    };
    GetProgress();
  }, []);

// {taskList.length > 0 ? (
// 	taskList.map((task, index) => {
// 		<ProgressCard cardTask={task} text={taskText[index]} />;
// 	})
// ) : (
// 	<Text>NO TASKS</Text>
// )}
