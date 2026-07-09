import { auth } from "../firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { initUI } from "./UI.js";

initUI();


const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");


// ===============================
// PASSWORD SHOW / HIDE
// ===============================

const showPasswordBtn = document.getElementById("showPassword");


if (showPasswordBtn) {

    showPasswordBtn.addEventListener("click", () => {


        if (password.type === "password") {


            password.type = "text";


            showPasswordBtn.innerHTML = `
                <span class="material-symbols-rounded">
                    visibility_off
                </span>
            `;


        } else {


            password.type = "password";


            showPasswordBtn.innerHTML = `
                <span class="material-symbols-rounded">
                    visibility
                </span>
            `;


        }


    });

}





// ===============================
// DARK MODE LOGO SWITCH
// ===============================


const logo = document.getElementById("logo");


function updateLogo(){

    if(!logo) return;


    const isDark =
    document.documentElement.classList.contains("dark");


    if(isDark){

        logo.src = "logo-dark.png";

    }
    else{

        logo.src = "logo-light.png";

    }

}


// Run when page loads
updateLogo();



// Watch theme changes
const observer = new MutationObserver(()=>{

    updateLogo();

});


observer.observe(
    document.documentElement,
    {
        attributes:true,
        attributeFilter:["class"]
    }
);







// ===============================
// FIREBASE AUTH CHECK
// ===============================


onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "Dashboard.html";

    }

});






// ===============================
// LOGIN
// ===============================


loginBtn.addEventListener("click", async () => {


    loginError.textContent = "";


    if (!email.value || !password.value) {


        loginError.textContent =
        "Please enter your email and password.";


        return;

    }



    try {


        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );


        window.location.href =
        "Dashboard.html";



    } catch(error){


        switch(error.code){


            case "auth/invalid-email":

                loginError.textContent =
                "Invalid email address.";

                break;



            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":


                loginError.textContent =
                "Incorrect email or password.";

                break;



            default:


                loginError.textContent =
                error.message;


        }


    }


});