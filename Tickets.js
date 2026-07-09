import { db } from "./firebase-config.js";
import { listenToEquipment, initUI } from "./UI.js";

initUI();

import {
    ref,
    push,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================
FIREBASE
========================= */

const ticketsRef = ref(db, "maintenanceTickets");


/* =========================
ELEMENTS
========================= */

const ticketTable = document.getElementById("ticketTable");

const searchInput = document.getElementById("searchTicket");

const ticketModal = document.getElementById("ticketModal");
const detailsModal = document.getElementById("ticketDetailsModal");

const openTicketModal = document.getElementById("openTicketModal");

const closeTicketModal = document.getElementById("closeTicketModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");

const submitTicketBtn = document.getElementById("submitTicketBtn");

const reporterInput = document.getElementById("tReporter");
const equipmentInput = document.getElementById("tEquipment");
const issueInput = document.getElementById("tIssue");
const priorityInput = document.getElementById("tPriority");

const equipmentList = document.getElementById("equipmentList");


/* =========================
CURRENT DATA
========================= */

let ticketData = {};
let selectedTicketId = null;


/* =========================
EQUIPMENT DROPDOWN
========================= */

listenToEquipment((equipment)=>{

    if(!equipmentList) return;

    equipmentList.innerHTML="";


    Object.values(equipment).forEach(item=>{

        const option=document.createElement("option");

        option.value =
        `${item.brand} ${item.model}`;

        equipmentList.appendChild(option);

    });

});



/* =========================
MODAL CONTROL
========================= */

openTicketModal?.addEventListener("click",()=>{

    ticketModal.style.display="flex";

});


closeTicketModal?.addEventListener("click",()=>{

    ticketModal.style.display="none";

});


closeDetailsModal?.addEventListener("click",()=>{

    detailsModal.style.display="none";

});


window.addEventListener("click",(e)=>{


    if(e.target === ticketModal)
        ticketModal.style.display="none";


    if(e.target === detailsModal)
        detailsModal.style.display="none";


});



/* =========================
CREATE TICKET
========================= */

submitTicketBtn?.addEventListener("click",()=>{


    const reporter =
    reporterInput.value.trim();


    const equipment =
    equipmentInput.value.trim();


    const issue =
    issueInput.value.trim();


    const priority =
    priorityInput.value;



    if(!reporter || !equipment || !issue){

        alert("Please complete all fields.");

        return;

    }



    push(ticketsRef,{

        reporter,

        equipment,

        issue,

        priority,

        status:"Open",

        createdAt:
        new Date().toLocaleString()

    })
    .then(()=>{


        updateEquipmentStatusByName(
            equipment,
            "Open"
        );


    });



    reporterInput.value="";
    equipmentInput.value="";
    issueInput.value="";
    priorityInput.value="Low";


    ticketModal.style.display="none";


});



/* =========================
UPDATE EQUIPMENT STATUS
========================= */


function updateEquipmentStatusByName(
    name,
    ticketStatus
){


    const equipmentRef =
    ref(db,"equipment");


    onValue(equipmentRef,(snapshot)=>{


        const equipment =
        snapshot.val() || {};



        Object.entries(equipment).forEach(([id,item])=>{


            const fullName =
            `${item.brand} ${item.model}`;



            if(fullName !== name)
                return;



            let newStatus;



            switch(ticketStatus){


                case "Open":

                    newStatus="Maintenance";

                    break;


                case "In Progress":

                    newStatus="Maintenance";

                    break;


                case "Completed":

                    newStatus="Available";

                    break;


                case "Broken":

                    newStatus="Needs Attention";

                    break;


                default:

                    return;

            }



            update(

                ref(db,"equipment/"+id),

                {
                    status:newStatus
                }

            );


        });


    },
    {
        onlyOnce:true
    });


}



/* =========================
DISPLAY TICKETS
========================= */


function renderTickets(data){


    if(!ticketTable)
        return;


    ticketTable.innerHTML="";



    Object.entries(data).forEach(([id,ticket])=>{


        if(
            ticket.status !== "Open" &&
            ticket.status !== "In Progress" &&
            ticket.status !== "Broken"
        )
        return;



        const row=document.createElement("tr");



        row.innerHTML=`

        <td>${id.substring(0,6)}</td>

        <td>${ticket.equipment}</td>

        <td>${ticket.reporter}</td>

        <td>${ticket.priority}</td>

        <td>${ticket.status}</td>

        <td>${ticket.createdAt}</td>


        <td>

        <button
        class="viewTicketBtn"
        data-id="${id}">

        Manage

        </button>


        </td>

        `;



        ticketTable.appendChild(row);


    });


}




/* =========================
LIVE TICKETS
========================= */


onValue(ticketsRef,(snapshot)=>{


    ticketData =
    snapshot.val() || {};


    renderTickets(ticketData);


});




/* =========================
SEARCH
========================= */


searchInput?.addEventListener("input",()=>{


    const text =
    searchInput.value.toLowerCase();



    const filtered={};



    Object.entries(ticketData).forEach(([id,ticket])=>{


        const values=`

        ${ticket.equipment}

        ${ticket.reporter}

        ${ticket.priority}

        ${ticket.status}

        `.toLowerCase();



        if(values.includes(text)){


            filtered[id]=ticket;


        }


    });



    renderTickets(filtered);


});





/* =========================
MANAGE TICKET
========================= */


ticketTable?.addEventListener("click",(e)=>{


    if(
        !e.target.classList.contains("viewTicketBtn")
    )
    return;



    const id =
    e.target.dataset.id;



    selectedTicketId=id;



    const ticket =
    ticketData[id];



    if(!ticket)
        return;



    document.getElementById("ticketId").textContent =
    id.substring(0,6);


    document.getElementById("ticketEquipment").textContent =
    ticket.equipment;


    document.getElementById("ticketReporter").textContent =
    ticket.reporter;


    document.getElementById("ticketIssue").textContent =
    ticket.issue;


    document.getElementById("ticketPriority").textContent =
    ticket.priority;


    document.getElementById("ticketStatus").textContent =
    ticket.status;



    detailsModal.style.display="flex";


});





/* =========================
UPDATE TICKET STATUS
========================= */


function updateTicketStatus(status){


    if(!selectedTicketId)
        return;



    const ticket =
    ticketData[selectedTicketId];



    update(

        ref(
            db,
            "maintenanceTickets/"+selectedTicketId
        ),

        {
            status:status
        }

    )
    .then(()=>{


        if(ticket){

            updateEquipmentStatusByName(
                ticket.equipment,
                status
            );

        }



        document.getElementById("ticketStatus").textContent =
        status;



        showToast("Ticket Updated");



        if(
            status==="Completed" ||
            status==="Broken"
        ){

            detailsModal.style.display="none";

        }


    });


}





/* =========================
BUTTON ACTIONS
========================= */


document.getElementById("startBtn")
?.addEventListener("click",()=>{

    updateTicketStatus(
        "In Progress"
    );

});



document.getElementById("completeBtn")
?.addEventListener("click",()=>{

    updateTicketStatus(
        "Completed"
    );

});



document.getElementById("brokenBtn")
?.addEventListener("click",()=>{

    updateTicketStatus(
        "Broken"
    );

});





/* =========================
TOAST
========================= */


function showToast(message){


    const toast =
    document.getElementById("toast");


    if(!toast)
        return;



    toast.textContent=message;


    toast.classList.add("show");



    setTimeout(()=>{


        toast.classList.remove("show");


    },2500);


}