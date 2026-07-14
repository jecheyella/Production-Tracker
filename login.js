import { auth } from "./firebase-config.js";

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

const showPasswordBtn = document.getElementById("showPassword");
const logo = document.getElementById("logo");
const rememberMe = document.getElementById("rememberMe");




// ===============================
// PASSWORD SHOW / HIDE
// ===============================

if(showPasswordBtn){

    showPasswordBtn.addEventListener("click",()=>{


        if(password.type === "password"){

            password.type = "text";

            showPasswordBtn.innerHTML = `
            <span class="material-symbols-rounded">
            visibility_off
            </span>
            `;

        }

        else{

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
// DARK MODE LOGO
// ===============================

function updateLogo(){

    if(!logo) return;


    const dark =
    document.documentElement.classList.contains("dark");


    logo.src = dark
    ? "logo-dark.png"
    : "logo-light.png";

}


updateLogo();



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
// CHECK LOGIN SESSION
// ===============================


onAuthStateChanged(auth,(user)=>{

    if(user){

        window.location.href="Dashboard.html";

    }

});






// ===============================
// LOGIN FUNCTION
// ===============================


async function login(){


    loginError.textContent="";


    if(!email.value || !password.value){

        loginError.textContent =
        "Please enter your email and password.";

        return;

    }



    try{


        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );



        if(rememberMe && rememberMe.checked){

            localStorage.setItem(
                "rememberEmail",
                email.value
            );

        }
        else{

            localStorage.removeItem(
                "rememberEmail"
            );

        }



        window.location.href =
        "Dashboard.html";



    }


    catch(error){


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


}





// Button Login

if(loginBtn){

    loginBtn.addEventListener(
        "click",
        login
    );

}





// Press Enter to Login

document.addEventListener(
"keydown",
(e)=>{

    if(e.key==="Enter"){

        login();

    }

});





// Load saved email

const savedEmail =
localStorage.getItem("rememberEmail");


if(savedEmail && email){

    email.value = savedEmail;

    if(rememberMe){

        rememberMe.checked=true;

    }

}