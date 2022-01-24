// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFU4aewB4NrV-THsXixV1ZVZy7wlIa-uA",
  authDomain: "teamproject-11334.firebaseapp.com",
  projectId: "teamproject-11334",
  storageBucket: "teamproject-11334.appspot.com",
  messagingSenderId: "139833585468",
  appId: "1:139833585468:web:f32b73f85ecda845417839"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);