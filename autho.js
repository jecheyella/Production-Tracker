import { auth } from "../firebase-config.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function initAuth() {

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const loginPage = document.getElementById("loginPage");
    const appLayout = document.getElementById("appLayout");

    loginBtn?.addEventListener("click", () => {
        signInWithEmailAndPassword(auth, email.value, password.value)
            .catch(err => alert(err.message));
    });

    logoutBtn?.addEventListener("click", () => {
        signOut(auth);
    });

    onAuthStateChanged(auth, (user) => {

        if (user) {
            loginPage.style.display = "none";
            appLayout.style.display = "flex";
        } else {
            loginPage.style.display = "flex";
            appLayout.style.display = "none";
        }

    });
}