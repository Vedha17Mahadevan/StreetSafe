import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCer1djgs1qIUfyub9o1iqPMtuVFpA_sGU",
    authDomain: "streetsafe-b4d51.firebaseapp.com",
    databaseURL: "https://streetsafe-b4d51-default-rtdb.firebaseio.com",
    projectId: "streetsafe-b4d51",
    storageBucket: "streetsafe-b4d51.firebasestorage.app",
    messagingSenderId: "715730080498",
    appId: "1:715730080498:web:a227fa0868aabe7cd1f66b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
