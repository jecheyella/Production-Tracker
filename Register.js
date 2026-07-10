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
    const userEmail = email.value.trim();
    const userPassword = password.value;
    const confirm = confirmPassword.value;

    // Validate fields
    if (!name || !userEmail || !userPassword || !confirm) {

        registerError.textContent = "Please fill in all fields.";
        return;

    }

    if (userPassword !== confirm) {

        registerError.textContent = "Passwords do not match.";
        return;

    }

    if (userPassword.length < 6) {

        registerError.textContent = "Password must be at least 6 characters.";
        return;

    }

    try {

        // Create Firebase Auth account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userEmail,
            userPassword
        );

        const uid = userCredential.user.uid;

        // Save user information to Realtime Database
        await set(ref(db, "Users/" + uid), {

            fullName: name,
            email: userEmail,

            role: "Employee",

            createdAt: new Date().toISOString()

        });

        alert("Account created successfully!");

        window.location.href = "Production.html";

    } catch (error) {

        switch (error.code) {

            case "auth/email-already-in-use":
                registerError.textContent = "This email is already registered.";
                break;

            case "auth/invalid-email":
                registerError.textContent = "Please enter a valid email.";
                break;

            case "auth/weak-password":
                registerError.textContent = "Password is too weak.";
                break;

            default:
                registerError.textContent = error.message;

        }

    }

});