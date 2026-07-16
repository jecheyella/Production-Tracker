import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

let timeout;

export function initInactivityLogout() {

    const resetTimer = () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            alert("Session expired due to inactivity.");

            await signOut(auth);

            window.location.href = "Production.html";
        }, TIMEOUT);
    };

    // Reset timer whenever user interacts
    ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"].forEach(event => {
        document.addEventListener(event, resetTimer);
    });

    resetTimer();
}