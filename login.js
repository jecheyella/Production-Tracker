import { auth } from "../firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {initUI } from "./UI.js";

initUI();

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// If already logged in, go straight to Dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "Dashboard.html";
    }
});

loginBtn.addEventListener("click", async () => {

    loginError.textContent = "";

    if (!email.value || !password.value) {
        loginError.textContent = "Please enter your email and password.";
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        // Redirect after successful login
        window.location.href = "Dashboard.html";

    } catch (error) {

        switch (error.code) {

            case "auth/invalid-email":
                loginError.textContent = "Invalid email address.";
                break;

            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                loginError.textContent = "Incorrect email or password.";
                break;

            default:
                loginError.textContent = error.message;

        }

    }

});