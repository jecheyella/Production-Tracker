import { listenToEquipment, initUI } from "./UI.js";

initUI();

/* =========================
ELEMENTS
========================= */

const table = document.getElementById("equipmentTable");
const searchInput = document.getElementById("searchInput");

/* =========================
STORE EQUIPMENT
========================= */

let equipmentData = {};

/* =========================
RENDER TABLE
========================= */

function renderTable(data) {

    if (!table) return;

    table.innerHTML = "";

    Object.values(data).forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.brand || "-"}</td>
            <td>${item.model || "-"}</td>
            <td>${item.category || "-"}</td>
            <td>${item.quantity || 0}</td>
            <td>${item.status || "-"}</td>
        `;

        table.appendChild(row);

    });

}

/* =========================
LIVE FIREBASE LISTENER
========================= */

listenToEquipment((data) => {

    equipmentData = data || {};

    renderTable(equipmentData);

});

/* =========================
SEARCH
========================= */

searchInput?.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = {};

    Object.entries(equipmentData).forEach(([id, item]) => {

        const text = `
            ${item.brand}
            ${item.model}
            ${item.category}
            ${item.status}
        `.toLowerCase();

        if (text.includes(keyword)) {
            filtered[id] = item;
        }

    });

    renderTable(filtered);

});