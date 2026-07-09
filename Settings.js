import { auth } from "./firebase-config.js";
import { initUI } from "./UI.js";

import {
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

initUI();
/* =========================
ELEMENTS
========================= */


const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const changePasswordBtn = document.getElementById("changePasswordBtn");
const logoutBtn = document.getElementById("logoutBtn");


/* =========================
LOAD SETTINGS
========================= */

const savedSidebar = localStorage.getItem("sidebarCollapsed");



/* ---------- Sidebar ---------- */

if (savedSidebar === "true") {

    sidebar.classList.add("collapsed");

    sidebarToggle.checked = true;

}





/* =========================
SIDEBAR
========================= */

sidebarToggle?.addEventListener("change", () => {

    sidebar.classList.toggle("collapsed");

    localStorage.setItem(
        "sidebarCollapsed",
        sidebar.classList.contains("collapsed")
    );

});


/* =========================
CHANGE PASSWORD
========================= */

changePasswordBtn?.addEventListener("click", () => {

    const user = auth.currentUser;

    if (!user) {

        alert("No user is signed in.");

        return;

    }

    sendPasswordResetEmail(auth, user.email)

        .then(() => {

            alert(
                "A password reset email has been sent to:\n\n" +
                user.email
            );

        })

        .catch(error => {

            alert(error.message);

        });

});


/* =========================
LOGOUT
========================= */

logoutBtn?.addEventListener("click", () => {

    signOut(auth)

        .then(() => {

            window.location.href = "Production.html";

        })

        .catch(error => {

            alert(error.message);

        });

});
