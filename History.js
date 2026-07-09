import { db } from "./firebase-config.js";

import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { listenToEquipment, initUI } from "./UI.js";

initUI();

/* =========================
FIREBASE
========================= */

const ticketsRef = ref(db, "maintenanceTickets");

/* =========================
ELEMENTS
========================= */

const historyTable = document.getElementById("historyTable");
const searchInput = document.getElementById("searchHistory");

/* =========================
CURRENT DATA
========================= */

let historyData = {};

/* =========================
RENDER TABLE
========================= */

function renderHistory(data) {

    if (!historyTable) return;

    historyTable.innerHTML = "";

    Object.entries(data).forEach(([id, ticket]) => {

        if (ticket.status !== "Completed") return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${ticket.equipment}</td>
            <td>${ticket.reporter}</td>
            <td>${ticket.issue}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.status}</td>
            <td>${ticket.createdAt}</td>
            <td>
            <button class="delete-btn">
            <span class="material-symbols-rounded">delete</span>
        </button>
            </td>
        `;

        // Attach click handler
        row.querySelector(".delete-btn").addEventListener("click", () => {
            deleteHistory(id);
        });

        // Append the row to the table
        historyTable.appendChild(row);

    });
}

/* =========================
LIVE FIREBASE
========================= */

onValue(ticketsRef, (snapshot) => {

    historyData = snapshot.val() || {};

    renderHistory(historyData);

});

/* =========================
DELETE HISTORY
========================= */

function deleteHistory(id){

    const confirmDelete = confirm(
        "Delete this maintenance history?"
    );

    if(!confirmDelete) return;

    const ticketRef = ref(db, `maintenanceTickets/${id}`);

    remove(ticketRef)
        .then(() => {
            console.log("History deleted");
        })
        .catch((error)=>{
            console.error(error);
        });

}

/* =========================
SEARCH
========================= */

searchInput?.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = {};

    Object.entries(historyData).forEach(([id, ticket]) => {

        const text = `
            ${ticket.equipment}
            ${ticket.reporter}
            ${ticket.issue}
            ${ticket.priority}
            ${ticket.status}
        `.toLowerCase();

        if (text.includes(search)) {

            filtered[id] = ticket;

        }

    });

    renderHistory(filtered);

});