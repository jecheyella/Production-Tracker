import { db } from "./firebase-config.js";

import {
    ref,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { hasPermission } from "./Role.js";

import { initUI } from "./UI.js";

initUI();

/* =========================
ROLE PERMISSIONS
========================= */

let canCompleteMaintenance = false;

async function applyPermissions() {

    canCompleteMaintenance =
        await hasPermission("completeMaintenance");

}

applyPermissions();


/* =========================
ELEMENTS
========================= */

const table = document.getElementById("maintenanceTable");

const ticketsRef = ref(db, "maintenanceTickets");
const equipmentRef = ref(db, "equipment");


/* =========================
LOAD MAINTENANCE TICKETS
========================= */

onValue(ticketsRef, (snapshot) => {

    const data = snapshot.val() || {};

    let rows = "";


    Object.entries(data).forEach(([id, ticket]) => {


        if (ticket.status === "In Progress") {


            rows += `

            <tr>

                <td>${ticket.equipment || "-"}</td>

                <td>${ticket.reporter || "-"}</td>

                <td>${ticket.issue || "-"}</td>

                <td>${ticket.priority || "-"}</td>

                <td>${ticket.status}</td>

        <td>
    ${
        canCompleteMaintenance
            ? `
            <button
                class="completeRepair"
                data-id="${id}">
                Complete
            </button>
            `
            : "-"
    }
</td>

            </tr>

            `;

        }


    });


    if(table){
        table.innerHTML = rows;
    }


});



/* =========================
COMPLETE REPAIR
========================= */

document.addEventListener("click", async (e) => {

    if (!canCompleteMaintenance) return;


    if(!e.target.classList.contains("completeRepair"))
        return;


    const ticketId = e.target.dataset.id;



    // Get ticket information first

    onValue(
        ref(db, "maintenanceTickets/" + ticketId),
        (ticketSnapshot)=>{


            const ticket = ticketSnapshot.val();


            if(!ticket)
                return;



            /*
            =========================
            UPDATE TICKET STATUS
            =========================
            */


            update(
                ref(db, "maintenanceTickets/" + ticketId),
                {

                    status:"Completed",

                    completedAt:
                    new Date().toLocaleDateString()

                }
            );





            /*
            =========================
            UPDATE EQUIPMENT STATUS
            =========================
            */


            onValue(
                equipmentRef,
                (equipmentSnapshot)=>{


                    const equipment =
                    equipmentSnapshot.val() || {};



                    Object.entries(equipment)
                    .forEach(([equipmentId,item])=>{


                        const fullName =
                        `${item.brand} ${item.model}`
                        .toLowerCase();



                        const ticketEquipment =
                        ticket.equipment
                        .toLowerCase();



                        if(

                            fullName.includes(ticketEquipment)

                            ||

                            ticketEquipment.includes(fullName)

                            ||

                            item.brand
                            .toLowerCase()
                            .includes(ticketEquipment)

                            ||

                            item.model
                            .toLowerCase()
                            .includes(ticketEquipment)

                        ){


                            update(

                                ref(
                                db,
                                "equipment/" + equipmentId
                                ),

                                {

                                    status:"Available"

                                }

                            );


                        }


                    });



                },

                {
                    onlyOnce:true
                }

            );



        },

        {
            onlyOnce:true
        }

    );


});