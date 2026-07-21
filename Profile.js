import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { initUI } from "./UI.js";

initUI();

/* =========================
ELEMENTS
========================= */

const name = document.getElementById("userName");
const email = document.getElementById("userEmail");
const logout = document.getElementById("profileLogoutBtn");

const roleElement = document.getElementById("userRole");
const badgeElement = document.getElementById("userRoleBadge");

/* =========================
LOAD USER
========================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "Production.html";
        return;

    }

    try {

        const snapshot = await get(
            ref(db, "Users/" + user.uid)
        );

        if (snapshot.exists()) {

            const data = snapshot.val();

            name.textContent =
                data.fullName || "Unknown User";

            email.textContent =
                data.email || user.email;

            // Show Administrator instead of Admin
            let roleText = data.role || "Volunteer";

            if (roleText === "Admin") {
                roleText = "Administrator";
            }

            if (roleElement) {
                roleElement.textContent = roleText;
            }

            if (badgeElement) {
                badgeElement.textContent = roleText;
            }

        } else {

            console.log("User data not found.");

        }

    } catch (error) {

        console.error("Profile Error:", error);

    }

});

/* =========================
LOGOUT
========================= */

logout?.addEventListener("click", () => {

    signOut(auth);

});