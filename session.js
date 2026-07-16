import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

let timeout;
let initialized = false;

export function initInactivityLogout() {

    // Prevent duplicate event listeners
    if (initialized) return;
    initialized = true;

    const resetTimer = () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            alert("Your session has expired due to 15 minutes of inactivity.");

            try {
                await signOut(auth);
            } catch (error) {
                console.error("Error signing out:", error);
            }

            // Redirect to login page
            window.location.replace("Production.html");
        }, TIMEOUT);
    };

    // User activity that resets the timer
    const activityEvents = [
        "mousemove",
        "pointerdown",
        "keydown",
        "scroll",
        "click"
    ];

    activityEvents.forEach(event => {
        document.addEventListener(event, resetTimer);
    });

    // Start the timer when the page loads
    resetTimer();
}