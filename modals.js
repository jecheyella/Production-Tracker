/* =========================
   GLOBAL MODALS
========================= */

export function initializeModals() {

    // ================= EQUIPMENT =================
    const addEquipmentModal = document.getElementById("addEquipmentModal");
    const openAddModal = document.getElementById("openAddModal");
    const closeAddModal = document.getElementById("closeAddModal");

    openAddModal?.addEventListener("click", () => {
        addEquipmentModal.style.display = "flex";
    });

    closeAddModal?.addEventListener("click", () => {
        addEquipmentModal.style.display = "none";
    });


    // ================= TICKET =================
    const ticketModal = document.getElementById("ticketModal");
    const openTicketModal = document.getElementById("openTicketModal");
    const closeTicketModal = document.getElementById("closeTicketModal");

    openTicketModal?.addEventListener("click", () => {
        ticketModal.style.display = "flex";
    });

    closeTicketModal?.addEventListener("click", () => {
        ticketModal.style.display = "none";
    });


    // ================= EQUIPMENT STATUS MODAL =================
    const equipmentModal = document.getElementById("equipmentModal");
    const closeModal = document.getElementById("closeModal");

    closeModal?.addEventListener("click", () => {
        equipmentModal.style.display = "none";
    });


    // ================= CLICK OUTSIDE TO CLOSE =================
    window.addEventListener("click", (e) => {

        if (e.target === addEquipmentModal) {
            addEquipmentModal.style.display = "none";
        }

        if (e.target === ticketModal) {
            ticketModal.style.display = "none";
        }

        if (e.target === equipmentModal) {
            equipmentModal.style.display = "none";
        }

    });

}