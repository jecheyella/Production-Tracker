import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4QreUxPtoEeQjNhsclIkOfCVMIQNkTE4",
  authDomain: "productiontracker-276bd.firebaseapp.com",
  databaseURL: "https://productiontracker-276bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "productiontracker-276bd",
  storageBucket: "productiontracker-276bd.appspot.com",
  messagingSenderId: "995246707829",
  appId: "1:995246707829:web:a1a048884052c52f58543c"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);