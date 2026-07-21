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
const roleElement = document.getElementById("userRole");
const badgeElement = document.getElementById("userRoleBadge");
const logout = document.getElementById("profileLogoutBtn");

/* =========================
LOAD USER PROFILE
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

        if (!snapshot.exists()) {

            name.textContent = "Unknown User";
            email.textContent = user.email || "-";

            if (roleElement) {
                roleElement.textContent = "-";
            }

            if (badgeElement) {
                badgeElement.textContent = "-";
            }

            return;

        }

        const data = snapshot.val();

        name.textContent =
            data.fullName || "Unknown User";

        email.textContent =
            data.email || user.email;

        const roleText =
            data.role === "Admin"
                ? "Administrator"
                : "Volunteer";

        if (roleElement) {
            roleElement.textContent = roleText;
        }

        if (badgeElement) {
            badgeElement.textContent = roleText;
        }

    } catch (error) {

        console.error("Failed to load profile:", error);

        name.textContent = "Unknown User";
        email.textContent = "-";

        if (roleElement) {
            roleElement.textContent = "-";
        }

        if (badgeElement) {
            badgeElement.textContent = "-";
        }

    }

});

/* =========================
LOGOUT
========================= */

logout?.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout failed:", error);

    }

});