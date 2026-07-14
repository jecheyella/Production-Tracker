import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function initAuth() {

    const logoutBtn = document.getElementById("logoutBtn");

    // =========================
    // LOGOUT
    // =========================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            try {

                await signOut(auth);

                window.location.href = "Production.html";

            } catch (error) {

                console.error(error);

            }

        });

    }

    // =========================
    // AUTH GUARD
    // =========================

    onAuthStateChanged(auth, (user) => {

        const currentPage =
            window.location.pathname.split("/").pop();

        // Pages that DON'T require login
        const publicPages = [
            "Production.html",
            "Register.html",
            "index.html"
        ];

        // If user is not logged in and tries to access a protected page
        if (!user && !publicPages.includes(currentPage)) {

            window.location.href = "Production.html";
            return;

        }

        // If already logged in and visits login/register
        if (
            user &&
            (
                currentPage === "Production.html" ||
                currentPage === "Register.html"
            )
        ) {

            window.location.href = "Dashboard.html";

        }

    });

}

initAuth();