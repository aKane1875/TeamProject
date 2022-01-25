import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCFU4aewB4NrV-THsXixV1ZVZy7wlIa-uA",
  authDomain: "teamproject-11334.firebaseapp.com",
  projectId: "teamproject-11334",
  storageBucket: "teamproject-11334.appspot.com",
  messagingSenderId: "139833585468",
  appId: "1:139833585468:web:f32b73f85ecda845417839"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export {firebase};