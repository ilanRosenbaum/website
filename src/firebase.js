import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: "ilan-web.firebaseapp.com",
  projectId: "ilan-web",
  storageBucket: "ilan-web.appspot.com",
  messagingSenderId: "870074135993",
  appId: "1:870074135993:web:91b3fabb9cd02cc3153268",
  measurementId: "G-RSBLK5DW2W"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { storage, firebaseConfig, analytics };
