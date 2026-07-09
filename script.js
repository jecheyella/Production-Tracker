import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    onValue,
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* =========================
LOGIN SYSTEM
========================= */

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginPage = document.getElementById("loginPage");
const appLayout = document.getElementById("appLayout");

let isAdmin = false;

loginBtn?.addEventListener("click", async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        window.location.href = "Dashboard.html";
    } catch (err) {
        alert(err.message);
    }
});

logoutBtn?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "Production.html";
    } catch (err) {
        alert(err.message);
    }
});

onAuthStateChanged(auth, (user) => {

    const currentPage = window.location.pathname.split("/").pop();

    // Login page
    if (currentPage === "Production.html" || currentPage === "") {

        if (user) {
            window.location.href = "Dashboard.html";
        }

    }
    // Any protected page
    else {

        if (!user) {
            window.location.href = "Production.html";
        }

    }

});

/* =========================
DARK MODE (FIXED + LOGO FIX)
========================= */

const darkToggle = document.getElementById("darkToggle");
const themeText = document.getElementById("themeText");
const themeIcon = document.getElementById("themeIcon");
const logo = document.getElementById("logo");

function updateLogo(isDark) {
    if (!logo) return;

    logo.src = isDark
        ? "logo-dark.png"
        : "logo-light.png";
}

function setTheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeText) {
        themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
    }

    if (themeIcon) {
        themeIcon.textContent = isDark ? "☀️" : "🌙";
    }

    updateLogo(isDark);
}

/* CLICK TOGGLE */
darkToggle?.addEventListener("click", () => {
    const isDark = !document.documentElement.classList.contains("dark");
    setTheme(isDark);
});

/* LOAD SAVED THEME */
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "dark");
updateLogo(savedTheme === "dark");

/* =========================
FIREBASE REFERENCES
========================= */

const equipmentRef = ref(db, "equipment");
const ticketsRef = ref(db, "maintenanceTickets");

/* =========================
TABLES
========================= */

const table = document.getElementById("equipmentTable");
const ticketTable = document.getElementById("ticketTable");

/* =========================
MODALS
========================= */

const addEquipmentModal = document.getElementById("addEquipmentModal");
const ticketModal = document.getElementById("ticketModal");

document.getElementById("openAddModal")?.addEventListener("click", () => {
    addEquipmentModal.style.display = "flex";
});

document.getElementById("openTicketModal")?.addEventListener("click", () => {
    ticketModal.style.display = "flex";
});

document.getElementById("closeAddModal")?.addEventListener("click", () => {
    addEquipmentModal.style.display = "none";
});

document.getElementById("closeTicketModal")?.addEventListener("click", () => {
    ticketModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === addEquipmentModal) addEquipmentModal.style.display = "none";
    if (e.target === ticketModal) ticketModal.style.display = "none";
});

/* =========================
ADD EQUIPMENT
========================= */

document.getElementById("saveEquipmentBtn")?.addEventListener("click", () => {

    push(equipmentRef, {
        brand: document.getElementById("addBrand").value,
        model: document.getElementById("addModel").value,
        category: document.getElementById("addCategory").value,
        quantity: document.getElementById("addQty").value,
        status: document.getElementById("addStatus").value
    });

    addEquipmentModal.style.display = "none";
});

/* =========================
ADD TICKET
========================= */

document.getElementById("submitTicketBtn")?.addEventListener("click", () => {

    const reporter = document.getElementById("tReporter").value;
    const equipment = document.getElementById("tEquipment").value;
    const issue = document.getElementById("tIssue").value;
    const priority = document.getElementById("tPriority").value;

    if (!reporter || !equipment || !issue) return;

    push(ticketsRef, {
        reporter,
        equipment,
        issue,
        priority,
        status: "Open",
        createdAt: Date.now()
    });

    ticketModal.style.display = "none";
});

/* =========================
LOAD EQUIPMENT + COUNTERS
========================= */

onValue(equipmentRef, (snapshot) => {

    const data = snapshot.val() || {};

    let rows = "";

    let total = 0;
    let available = 0;
    let maintenance = 0;
    let broken = 0;

    Object.entries(data).forEach(([id, item]) => {

        total++;

        const status = item.status || "";

        if (status === "Available") available++;
        else if (status === "Maintenance") maintenance++;
        else if (status === "Broken") broken++;

        rows += `
        <tr>
            <td>${item.brand || ""}</td>
            <td>${item.model || ""}</td>
            <td>${item.category || ""}</td>
            <td>${item.quantity || ""}</td>
            <td>${item.status || ""}</td>
            <td>
                <button class="manageBtn" data-id="${id}">View</button>
            </td>
        </tr>`;
    });

    if (table) table.innerHTML = rows;

const totalEquipment = document.getElementById("totalEquipment");
const availableEquipment = document.getElementById("availableEquipment");
const maintenanceEquipment = document.getElementById("maintenanceEquipment");
const brokenEquipment = document.getElementById("brokenEquipment");

if (totalEquipment) totalEquipment.textContent = total;
if (availableEquipment) availableEquipment.textContent = available;
if (maintenanceEquipment) maintenanceEquipment.textContent = maintenance;
if (brokenEquipment) brokenEquipment.textContent = broken;
});

/* =========================
LOAD TICKETS
========================= */

onValue(ticketsRef, (snapshot) => {

    const data = snapshot.val() || {};
    let rows = "";

    Object.entries(data).forEach(([id, item]) => {

        rows += `
        <tr>
            <td>${item.reporter}</td>
            <td>${item.equipment}</td>
            <td>${item.issue}</td>
            <td>${item.priority}</td>
            <td>${item.status}</td>
        </tr>`;
    });

    if (ticketTable) ticketTable.innerHTML = rows;
});