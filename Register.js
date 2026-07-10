import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { initUI } from "./UI.js";

initUI();

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const registerBtn = document.getElementById("registerBtn");
const registerError = document.getElementById("registerError");


// =======================================
// PASSWORD TOGGLE
// =======================================

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) return;

    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML = `
                <span class="material-symbols-rounded">
                    visibility_off
                </span>
            `;

        } else {

            input.type = "password";

            button.innerHTML = `
                <span class="material-symbols-rounded">
                    visibility
                </span>
            `;

        }

    });

}

setupPasswordToggle("showPassword", "password");
setupPasswordToggle("showConfirmPassword", "confirmPassword");


// =======================================
// REGISTER ACCOUNT
// =======================================

registerBtn.addEventListener("click", async () => {

    registerError.textContent = "";

    const name = fullName.value.trim();
    const userEmail = email.value.trim().toLowerCase();
    const userPassword = password.value;
    const confirm = confirmPassword.value;

    // ==========================
    // VALIDATION
    // ==========================

    if (!name || !userEmail || !userPassword || !confirm) {
        registerError.textContent = "Please complete all required fields.";
        return;
    }

    if (name.length < 3) {
        registerError.textContent = "Please enter your full name.";
        return;
    }

    if (userPassword !== confirm) {
        registerError.textContent = "Passwords do not match.";
        return;
    }

    if (userPassword.length < 6) {
        registerError.textContent = "Password must contain at least 6 characters.";
        return;
    }

    // ==========================
    // LOADING
    // ==========================

    registerBtn.disabled = true;
    registerBtn.textContent = "Creating Account...";

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                userEmail,
                userPassword
            );

        const uid = userCredential.user.uid;

        await set(ref(db, "Users/" + uid), {

            uid,

            fullName: name,

            email: userEmail,

            role: "Employee",

            status: "Active",

            profileImage: "",

            createdAt: new Date().toISOString()

        });

        registerError.style.color = "#22c55e";
        registerError.textContent =
            "✅ Account created successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "Production.html";

        }, 1800);

    } catch (error) {

        registerError.style.color = "#ef4444";

        switch (error.code) {

            case "auth/email-already-in-use":
                registerError.textContent =
                    "This email is already registered.";
                break;

            case "auth/invalid-email":
                registerError.textContent =
                    "Please enter a valid email address.";
                break;

            case "auth/weak-password":
                registerError.textContent =
                    "Password is too weak.";
                break;

            default:
                registerError.textContent =
                    error.message;
        }

    } finally {

        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";

    }

});