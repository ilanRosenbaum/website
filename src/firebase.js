import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5ibHGjSN15z78oo8BbZK2Zi4juVmoNHg",
  authDomain: "ilan-web.firebaseapp.com",
  projectId: "ilan-web",
  storageBucket: "ilan-web.appspot.com",
  messagingSenderId: "870074135993",
  appId: "1:870074135993:web:91b3fabb9cd02cc3153268",
  measurementId: "G-RSBLK5DW2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { storage, firebaseConfig, analytics };
