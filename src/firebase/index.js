import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBui_TwrD-19UI7jeyqiTLXBGqsXDfh7Cg",
  authDomain: "mhwlib.firebaseapp.com",
  projectId: "mhwlib",
  storageBucket: "mhwlib.appspot.com",
  messagingSenderId: 160014247151,
  appId: "1:160014247151:web:1c20d3b5569b2ca29da71a",
  measurementId: "G-QXXJLMDSMM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
  app,
  db
}