import { auth, db } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* ======================================
GET CURRENT USER ROLE
====================================== */

export async function getCurrentUserRole() {

    const user = auth.currentUser;

    if (!user) {
        return null;
    }

    try {

        const snapshot = await get(ref(db, "Users/" + user.uid));

        if (!snapshot.exists()) {
            return null;
        }

        return snapshot.val().role;

    } catch (error) {

        console.error("Error getting user role:", error);
        return null;

    }

}


/* ======================================
CHECK IF ADMIN
====================================== */

export async function isAdmin() {

    const role = await getCurrentUserRole();
    return role === "Admin";

}


/* ======================================
CHECK IF VOLUNTEER
====================================== */

export async function isVolunteer() {

    const role = await getCurrentUserRole();
    return role === "Volunteer";

}


/* ======================================
PERMISSIONS
====================================== */

export const permissions = {

    Admin: {

        dashboard: true,
        inventory: true,
        searchEquipment: true,
        addEquipment: true,
        editEquipment: true,
        deleteEquipment: true,

        tickets: true,
        createTicket: true,
        completeTicket: true,
        deleteTicket: true,

        maintenance: true,
        history: true,

        profile: true,
        settings: true

    },

    Volunteer: {

    dashboard: true,
    inventory: true,
    searchEquipment: true,
    addEquipment: false,
    editEquipment: false,
    deleteEquipment: false,

    tickets: true,
    createTicket: true,
    completeTicket: false,
    deleteTicket: false,

    maintenance: true,          // ✅ Can open the page
    completeMaintenance: false, // ❌ Cannot complete repairs

    history: true,

    profile: true,
    settings: true

    }

};


/* ======================================
CHECK PERMISSION
====================================== */

export async function hasPermission(permissionName) {

    const role = await getCurrentUserRole();

    if (!role) return false;

    return permissions[role]?.[permissionName] ?? false;

}