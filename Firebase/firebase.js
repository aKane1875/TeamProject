//import * as firebase from 'firebase';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCFU4aewB4NrV-THsXixV1ZVZy7wlIa-uA",
  authDomain: "teamproject-11334.firebaseapp.com",
  projectId: "teamproject-11334",
  storageBucket: "teamproject-11334.appspot.com",
  messagingSenderId: "139833585468",
  appId: "1:139833585468:web:f32b73f85ecda845417839"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// if(!firebase.apps.length){
//   firebase.initializeApp(firebaseConfig);
// }

// export {firebase};