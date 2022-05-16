import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyBwmZvR-rRz6IQJtR_Vg10cRwmsMmS8TNo",
    authDomain: "craftdemo-fd985.firebaseapp.com",
    projectId: "craftdemo-fd985",
    storageBucket: "craftdemo-fd985.appspot.com",
    messagingSenderId: "301580725671",
    appId: "1:301580725671:web:8a4cc897beed0029f59a82"
});


export const db = getFirestore(app);
export default app;