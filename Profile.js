import { auth,db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { listenToEquipment, initUI } from "./UI.js";


initUI();
const name = document.getElementById("userName");
const email = document.getElementById("userEmail");

const logout =
document.getElementById("profileLogoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "Production.html";
        return;

    }

    try {

        const snapshot = await get(
            ref(db, "Users/" + user.uid)
        );

        if (snapshot.exists()) {

            const data = snapshot.val();

            name.textContent =
                data.fullName || "Unknown User";

            email.textContent =
                data.email || user.email;

            const roleElement =
                document.getElementById("userRole");

            if (roleElement) {

                roleElement.textContent =
                    data.role || "Volunteer";

            }

        }

    } catch (error) {

        console.error(error);

    }

});

logout?.addEventListener("click",()=>{

    signOut(auth);

});