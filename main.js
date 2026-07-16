import { initUI } from "./UI.js";
import { initInactivityLogout } from "./session.js";

import "./auth.js";
import "./dashboard.js";
import "./inventory.js";
import "./tickets.js";
import "./maintenance.js";
import "./history.js";
import "./profile.js";

window.addEventListener("DOMContentLoaded", () => {

    initUI();
    initInactivityLogout();

});