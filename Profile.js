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

const role = document.getElementById("userRole");
const badge = document.getElementById("userRoleBadge");

const logout =
document.getElementById("profileLogoutBtn");


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

            let displayRole =
                data.role || "Volunteer";

            if (displayRole === "Admin") {

                displayRole = "Administrator";

            }

            if (role) {

                role.textContent =
                    displayRole;

            }

            if (badge) {

                badge.textContent =
                    displayRole;

            }

        } else {

            name.textContent =
                user.displayName || "Unknown User";

            email.textContent =
                user.email;

        }

    } catch (error) {

        console.error(error);

    }

});


/* =========================
LOGOUT
========================= */

logout?.addEventListener("click", () => {

    signOut(auth);

});