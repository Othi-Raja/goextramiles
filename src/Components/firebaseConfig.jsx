// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
//firebase configration
const firebaseConfig = {
  apiKey: "AIzaSyB4Ko0rFxCVJQs_3IkRkOT0T8ZiKFwGYww",
  authDomain: "gem-website-dev.firebaseapp.com",
  projectId: "gem-website-dev",
  storageBucket: "gem-website-dev.appspot.com",
  messagingSenderId: "244096394468",
  appId: "1:244096394468:web:77f8363331bd3382ebb8f1",
  measurementId: "G-XCLWMGZJJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const firestoreDb = getFirestore()
// const CollectionDb = collection()
// const analytics = getAnalytics(app);
export default app;
export { auth, provider, firestoreDb, collection, getDocs };