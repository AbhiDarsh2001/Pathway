// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGC3Uq2pDMgxtpHSUbZzW16ZKfxYx3G5A",
  authDomain: "pathway-86a73.firebaseapp.com",
  projectId: "pathway-86a73",
  storageBucket: "pathway-86a73.appspot.com",
  messagingSenderId: "267593694765",
  appId: "1:267593694765:web:c9df86c07a268a26b3c2a4",
  measurementId: "G-QKL0PBL4JB"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Export the Firebase app
export { firebaseApp };
