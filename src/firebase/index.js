import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || "AIzaSyBui_TwrD-19UI7jeyqiTLXBGqsXDfh7Cg",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || "mhwlib.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || "mhwlib",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "mhwlib.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "160014247151",
  appId: process.env.REACT_APP_APP_ID || "1:160014247151:web:1c20d3b5569b2ca29da71a",
  measurementId: process.env.REACT_APP_MEASUREMENT_ID || "G-QXXJLMDSMM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
  app,
  db
}