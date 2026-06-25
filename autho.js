import { auth } from "./firebase-config.js";
import {
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// LOGIN
export function login(email, password) {
return signInWithEmailAndPassword(auth, email, password);
}

// LOGOUT
export function logout() {
return signOut(auth);
}

// AUTH STATE LISTENER
export function onUserChange(callback) {
return onAuthStateChanged(auth, callback);
}