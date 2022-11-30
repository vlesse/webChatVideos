// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsT2b9eiWdWugco_h1L_8N-r5Kquaq6Zc",
    authDomain: "webapp-videos.firebaseapp.com",
    projectId: "webapp-videos",
    storageBucket: "webapp-videos.appspot.com",
    messagingSenderId: "833588000555",
    appId: "1:833588000555:web:42ab67593142149aadf76e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB, "users");

export const meetingsRef = collection(firebaseDB, "meetings");