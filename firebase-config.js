import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId"
});

export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;