import { db } from "./firebase-config.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* =========================
FIREBASE LISTENER
========================= */

let attached = false;

export function listenToEquipment(callback) {

    if (attached) return;

    attached = true;

    const equipmentRef = ref(db, "equipment");

    onValue(equipmentRef, (snapshot) => {

        callback(snapshot.val() || {});

    });

}

/* =========================
UPDATE LOGO
========================= */

function updateLogo() {

    const logo = document.getElementById("logo");

    if (!logo) return;

    if (document.documentElement.classList.contains("dark")) {

        logo.src = "logo-dark.png";

    } else {

        logo.src = "logo-light.png";

    }

}

/* =========================
INITIALIZE UI
========================= */
export function initUI() {

    console.log("UI loaded");

    const page = window.location.pathname.split("/").pop();

    const isAuthPage =
        page === "Production.html" ||
        page === "Register.html";

    // Login & Register are always light mode
    if (isAuthPage) {

        document.documentElement.classList.remove("dark");
        updateLogo();

        return;

    }

    // Other pages load the saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    const darkToggle = document.getElementById("darkToggle");
    const themeText = document.getElementById("themeText");
    const themeIcon = document.getElementById("themeIcon");

    updateLogo();

    darkToggle?.addEventListener("click", () => {

        console.log("Dark mode clicked");

        const dark =
            !document.documentElement.classList.contains("dark");

        document.documentElement.classList.toggle("dark", dark);

        localStorage.setItem("theme", dark ? "dark" : "light");

        updateLogo();

        if (themeText)
            themeText.textContent = dark ? "Light Mode" : "Dark Mode";

        if (themeIcon)
            themeIcon.textContent = dark ? "☀️" : "🌙";

    });

}