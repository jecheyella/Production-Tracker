import { db } from "./firebase-config.js";

import {
    ref,
    update,
    remove,
    onValue,
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { listenToEquipment, initUI } from "./UI.js";

initUI();

/* =========================
ELEMENTS
========================= */

const totalEquipment = document.getElementById("totalEquipment");
const availableEquipment = document.getElementById("availableEquipment");
const maintenanceEquipment = document.getElementById("maintenanceEquipment");
const brokenEquipment = document.getElementById("brokenEquipment");

const openTickets = document.getElementById("openTickets");
const progressTickets = document.getElementById("progressTickets");
const completedTickets = document.getElementById("completedTickets");

const tableBody = document.getElementById("equipmentTable");
const searchInput = document.getElementById("searchInput");

const submitTicketBtn = document.getElementById("submitTicketBtn");

const reporterInput = document.getElementById("tReporter");
const equipmentInput = document.getElementById("tEquipment");
const issueInput = document.getElementById("tIssue");
const priorityInput = document.getElementById("tPriority");

const equipmentList = document.getElementById("equipmentList");

const ticketsRef = ref(db, "maintenanceTickets");
const equipmentRef = ref(db, "equipment");

/* =========================
CURRENT DATA
========================= */

let equipmentData = {};
let selectedEquipmentId = null;

/* =========================
RENDER TABLE
========================= */

function renderTable(data) {

    if (!tableBody) return;

    tableBody.innerHTML = "";

    Object.entries(data).forEach(([id, item]) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.brand || "-"}</td>
            <td>${item.model || "-"}</td>
            <td>${item.category || "-"}</td>
            <td>${item.quantity || 0}</td>
            <td>${item.status || "-"}</td>
            <td>
                <button
                    class="manageBtn"
                    data-id="${id}">
                    Manage
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}
/* =========================
LIVE EQUIPMENT DATA
========================= */

listenToEquipment((data) => {

    equipmentData = data;

    // Populate equipment datalist
    if (equipmentList) {

        equipmentList.innerHTML = "";

        Object.values(data).forEach(item => {

            const option = document.createElement("option");
            option.value = `${item.brand} ${item.model}`;
            equipmentList.appendChild(option);

        });

    }

    let total = 0;
    let available = 0;
    let maintenance = 0;
    let broken = 0;

    Object.values(data).forEach(item => {

        total++;

        switch (item.status) {

            case "Available":
                available++;
                break;

            case "Maintenance":
                maintenance++;
                break;

            case "Needs Attention":
            case "Broken":
                broken++;
                break;

        }

    });

    if (totalEquipment)
        totalEquipment.textContent = total;

    if (availableEquipment)
        availableEquipment.textContent = available;

    if (maintenanceEquipment)
        maintenanceEquipment.textContent = maintenance;

    if (brokenEquipment)
        brokenEquipment.textContent = broken;

    renderTable(data);

});


/* =========================
LIVE TICKET COUNTS
========================= */

onValue(ticketsRef, (snapshot) => {

    const tickets = snapshot.val() || {};

    let open = 0;
    let progress = 0;
    let completed = 0;

    Object.values(tickets).forEach(ticket => {

        switch (ticket.status) {

            case "Open":
                open++;
                break;

            case "In Progress":
                progress++;
                break;

            case "Completed":
                completed++;
                break;

        }

    });

    if (openTickets)
        openTickets.textContent = open;

    if (progressTickets)
        progressTickets.textContent = progress;

    if (completedTickets)
        completedTickets.textContent = completed;

});


/* =========================
SEARCH
========================= */

searchInput?.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = {};

    Object.entries(equipmentData).forEach(([id, item]) => {

        const searchText = `
            ${item.brand}
            ${item.model}
            ${item.category}
            ${item.status}
        `.toLowerCase();

        if (searchText.includes(keyword)) {

            filtered[id] = item;

        }

    });

    renderTable(filtered);

});
/* =========================
CREATE TICKET
========================= */

submitTicketBtn?.addEventListener("click", () => {

    const reporter = reporterInput.value.trim();
    const equipmentName = equipmentInput.value.trim();
    const issue = issueInput.value.trim();
    const priority = priorityInput.value;

    if (!reporter || !equipmentName || !issue) {
        alert("Please complete all fields.");
        return;
    }

    push(ticketsRef, {

        reporter,
        equipment: equipmentName,
        issue,
        priority,

        status: "Open",

        createdAt: new Date().toLocaleString()

    })
    .then(() => {

        updateEquipmentStatusByTicket(
            equipmentName,
            "Open"
        );

        reporterInput.value = "";
        equipmentInput.value = "";
        issueInput.value = "";
        priorityInput.value = "Low";

        ticketModal.style.display = "none";

        alert("Ticket Created Successfully");

    })
    .catch(console.error);

});


/* =========================
UPDATE EQUIPMENT STATUS
========================= */

function updateEquipmentStatusByTicket(
    equipmentName,
    ticketStatus
) {

    onValue(
        equipmentRef,
        (snapshot) => {

            const equipment = snapshot.val() || {};

            Object.entries(equipment).forEach(([id, item]) => {

                const fullName =
                    `${item.brand} ${item.model}`.toLowerCase();

                const keyword =
                    equipmentName.toLowerCase();

                if (
                    fullName.includes(keyword) ||
                    keyword.includes(fullName) ||
                    item.brand.toLowerCase().includes(keyword) ||
                    item.model.toLowerCase().includes(keyword)
                ) {

                    let newStatus = item.status;

                    switch (ticketStatus) {

                        case "Open":
                        case "In Progress":
                            newStatus = "Maintenance";
                            break;

                        case "Completed":
                            newStatus = "Available";
                            break;

                        case "Broken":
                            newStatus = "Needs Attention";
                            break;

                    }

                    update(
                        ref(db, "equipment/" + id),
                        {
                            status: newStatus
                        }
                    );

                }

            });

        },
        {
            onlyOnce: true
        }
    );

}
/* =========================
MODAL ELEMENTS
========================= */

const addEquipmentModal = document.getElementById("addEquipmentModal");
const ticketModal = document.getElementById("ticketModal");
const equipmentModal = document.getElementById("equipmentModal");

const openAddModal = document.getElementById("openAddModal");
const openTicketModal = document.getElementById("openTicketModal");

const closeAddModal = document.getElementById("closeAddModal");
const closeTicketModal = document.getElementById("closeTicketModal");
const closeModal = document.getElementById("closeModal");


/* =========================
OPEN MODALS
========================= */

openAddModal?.addEventListener("click", () => {

    addEquipmentModal.style.display = "flex";

});

openTicketModal?.addEventListener("click", () => {

    ticketModal.style.display = "flex";

});


/* =========================
CLOSE MODALS
========================= */

closeAddModal?.addEventListener("click", () => {

    addEquipmentModal.style.display = "none";

});

closeTicketModal?.addEventListener("click", () => {

    ticketModal.style.display = "none";

});

closeModal?.addEventListener("click", () => {

    equipmentModal.style.display = "none";

});


/* =========================
CLICK OUTSIDE TO CLOSE
========================= */

window.addEventListener("click", (e) => {

    if (e.target === addEquipmentModal)
        addEquipmentModal.style.display = "none";

    if (e.target === ticketModal)
        ticketModal.style.display = "none";

    if (e.target === equipmentModal)
        equipmentModal.style.display = "none";

});
/* =========================
MANAGE EQUIPMENT
========================= */

tableBody?.addEventListener("click", (e) => {

    if (!e.target.classList.contains("manageBtn")) return;

    selectedEquipmentId = e.target.dataset.id;

    const item = equipmentData[selectedEquipmentId];

    if (!item) return;

    document.getElementById("modalBrandInput").value =
        item.brand || "";

    document.getElementById("modalModelInput").value =
        item.model || "";

    document.getElementById("modalCategoryInput").value =
        item.category || "";

    document.getElementById("modalQuantityInput").value =
        item.quantity || "";

    document.getElementById("modalStatusInput").value =
        item.status || "";

    equipmentModal.style.display = "flex";

});


/* =========================
UPDATE STATUS
========================= */

function updateEquipmentStatus(status) {

    if (!selectedEquipmentId) return;

    // Only allow manual changes between these states
    if (!["Available", "In Use"].includes(status)) return;

    update(
        ref(db, "equipment/" + selectedEquipmentId),
        {
            status
        }
    )
    .then(() => {

        document.getElementById("modalStatusInput").value = status;

    })
    .catch(console.error);

}

document.getElementById("returnBtn")
?.addEventListener("click", () => {

    updateEquipmentStatus("Available");

});

document.getElementById("useBtn")
?.addEventListener("click", () => {

    updateEquipmentStatus("In Use");

});


/* =========================
EDIT EQUIPMENT
========================= */

let editing = false;

const editBtn = document.getElementById("editEquipmentBtn");

editBtn?.addEventListener("click", () => {

    if (!selectedEquipmentId) return;

    const brand = document.getElementById("modalBrandInput");
    const model = document.getElementById("modalModelInput");
    const category = document.getElementById("modalCategoryInput");
    const quantity = document.getElementById("modalQuantityInput");

    if (!editing) {

        editing = true;

        brand.readOnly = false;
        model.readOnly = false;
        category.readOnly = false;
        quantity.readOnly = false;

        editBtn.textContent = "💾 Save";

        return;

    }

    update(
        ref(db, "equipment/" + selectedEquipmentId),
        {
            brand: brand.value,
            model: model.value,
            category: category.value,
            quantity: Number(quantity.value)
        }
    )
    .then(() => {

        editing = false;

        brand.readOnly = true;
        model.readOnly = true;
        category.readOnly = true;
        quantity.readOnly = true;

        editBtn.textContent = "✏ Edit";

        alert("Equipment updated!");

    })
    .catch(console.error);

});


/* =========================
DELETE EQUIPMENT
========================= */

document.getElementById("deleteEquipmentBtn")
?.addEventListener("click", () => {

    if (!selectedEquipmentId) return;

    if (!confirm("Delete this equipment?")) return;

    remove(ref(db, "equipment/" + selectedEquipmentId))
    .then(() => {

        equipmentModal.style.display = "none";

        selectedEquipmentId = null;

    })
    .catch(console.error);

});