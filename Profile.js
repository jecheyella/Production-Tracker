import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { initUI } from "./UI.js";

initUI();

/* =========================
ELEMENTS
========================= */

const name = document.getElementById("userName");
const email = document.getElementById("userEmail");

const logout =
document.getElementById("profileLogoutBtn");

/* =========================
LOAD USER
========================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "Production.html";
        return;

    }

    name.textContent =
        user.displayName || "Administrator";

    email.textContent =
        user.email;

});

/* =========================
LOGOUT
========================= */

logout?.addEventListener("click", () => {

    signOut(auth);

});