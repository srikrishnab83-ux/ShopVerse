/*==========================================================
  ShopVerse
  forgot-password.js
==========================================================*/

import { auth } from "./firebase-config.js";

import {

    sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/*==========================================================
DOM
==========================================================*/

const form = document.getElementById("forgotPasswordForm");

const email = document.getElementById("email");

const message = document.getElementById("resetMessage");

const loading = document.getElementById("loadingOverlay");

/*==========================================================
HELPERS
==========================================================*/

function showLoading() {

    loading.classList.add("active");

}

function hideLoading() {

    loading.classList.remove("active");

}

function showMessage(text, type) {

    message.className = "login-message";

    message.classList.add(type);

    message.innerHTML = text;

    message.style.display = "block";

}

function validEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

}

/*==========================================================
RESET PASSWORD
==========================================================*/

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.display = "none";

    if (!validEmail(email.value.trim())) {

        showMessage(

            "Please enter a valid email address.",

            "error"

        );

        return;

    }

    showLoading();

    try {

        await sendPasswordResetEmail(

            auth,

            email.value.trim()

        );

        hideLoading();

        showMessage(

            "Password reset email sent successfully. Please check your inbox.",

            "success"

        );

        form.reset();

    }

    catch (error) {

        hideLoading();

        let text = "Something went wrong.";

        switch (error.code) {

            case "auth/user-not-found":

                text = "No account exists with this email.";

                break;

            case "auth/invalid-email":

                text = "Invalid email address.";

                break;

            case "auth/network-request-failed":

                text = "Please check your internet connection.";

                break;

            case "auth/too-many-requests":

                text = "Too many requests. Please try again later.";

                break;

            default:

                text = error.message;

        }

        showMessage(text, "error");

    }

});