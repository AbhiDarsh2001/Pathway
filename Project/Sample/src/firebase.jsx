import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDyh-7zgqodNx1LKK04IqMiC6Ki348OMGs",
  authDomain: "career-pathway-b8728.firebaseapp.com",
  projectId: "career-pathway-b8728",
  storageBucket: "career-pathway-b8728.appspot.com",
  messagingSenderId: "103091169663",
  appId: "1:103091169663:web:ca8cef1331e8939cd6524a",
  measurementId: "G-VFHMB9DZPY"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export {firebaseApp};