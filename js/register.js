/*==========================================================
  ShopVerse
  File : register.js
  Customer Registration
  Part 1
==========================================================*/

import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/*==========================================================
DOM ELEMENTS
==========================================================*/

const registerForm = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const googleSignup = document.getElementById("googleSignup");

const registerMessage =
    document.getElementById("registerMessage");

const loadingOverlay =
    document.getElementById("loadingOverlay");

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

/*==========================================================
PASSWORD TOGGLE
==========================================================*/

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = button.parentElement.querySelector("input");

        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

/*==========================================================
HELPERS
==========================================================*/

function showLoading() {

    if (loadingOverlay)
        loadingOverlay.classList.add("active");

}

function hideLoading() {

    if (loadingOverlay)
        loadingOverlay.classList.remove("active");

}

function showMessage(message, type = "success") {

    if (!registerMessage) return;

    registerMessage.className = "login-message";

    registerMessage.classList.add(type);

    registerMessage.textContent = message;

    registerMessage.style.display = "block";

}

function clearMessage() {

    if (!registerMessage) return;

    registerMessage.className = "login-message";

    registerMessage.textContent = "";

    registerMessage.style.display = "none";

}

/*==========================================================
VALIDATION
==========================================================*/

function validEmail(value) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(value);

}

function validPhone(value) {

    return /^[6-9]\d{9}$/.test(value);

}

function validPassword(value) {

    return value.length >= 8;

}

/*==========================================================
PASSWORD STRENGTH
==========================================================*/

password.addEventListener("input", () => {

    const pass = password.value;

    let score = 0;

    if (pass.length >= 8)
        score++;

    if (/[A-Z]/.test(pass))
        score++;

    if (/[a-z]/.test(pass))
        score++;

    if (/[0-9]/.test(pass))
        score++;

    if (/[^A-Za-z0-9]/.test(pass))
        score++;

    switch (score) {

        case 0:
        case 1:

            strengthBar.style.width = "20%";
            strengthBar.style.background = "#ef4444";
            strengthText.textContent = "Weak Password";

            break;

        case 2:

            strengthBar.style.width = "45%";
            strengthBar.style.background = "#f59e0b";
            strengthText.textContent = "Fair Password";

            break;

        case 3:

            strengthBar.style.width = "65%";
            strengthBar.style.background = "#3b82f6";
            strengthText.textContent = "Good Password";

            break;

        case 4:

            strengthBar.style.width = "85%";
            strengthBar.style.background = "#22c55e";
            strengthText.textContent = "Strong Password";

            break;

        case 5:

            strengthBar.style.width = "100%";
            strengthBar.style.background = "#16a34a";
            strengthText.textContent = "Very Strong Password";

            break;

    }

});

/*==========================================================
FORM VALIDATION
==========================================================*/

function validateForm() {

    clearMessage();

    if (fullName.value.trim().length < 3) {

        showMessage(
            "Please enter your full name.",
            "error"
        );

        fullName.focus();

        return false;

    }

    if (!validEmail(email.value.trim())) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        email.focus();

        return false;

    }

    if (!validPhone(phone.value.trim())) {

        showMessage(
            "Enter a valid 10-digit mobile number.",
            "error"
        );

        phone.focus();

        return false;

    }

    if (!validPassword(password.value)) {

        showMessage(
            "Password must contain at least 8 characters.",
            "error"
        );

        password.focus();

        return false;

    }

    if (password.value !== confirmPassword.value) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        confirmPassword.focus();

        return false;

    }

    if (!terms.checked) {

        showMessage(
            "Please accept the Terms & Conditions.",
            "error"
        );

        return false;

    }

    return true;

}

/*==========================================================
PART 2 STARTS WITH:
CUSTOMER REGISTRATION
createUserWithEmailAndPassword()
Firestore save
Email Verification
Redirect to Login
==========================================================*/
/*==========================================================
  ShopVerse
  File : register.js
  Part 2
==========================================================*/

/*==========================================================
CUSTOMER REGISTRATION
==========================================================*/

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        showLoading();

        try {

            /* Create Firebase Auth User */

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email.value.trim(),
                    password.value
                );

            const user = credential.user;

            /* Update Firebase Profile */

            await updateProfile(user, {
                displayName: fullName.value.trim()
            });

            /* Send Verification Email */

            await sendEmailVerification(user);

            /* Save User to Firestore */

            await setDoc(doc(db, "users", user.uid), {

                uid: user.uid,

                name: fullName.value.trim(),

                email: email.value.trim().toLowerCase(),

                phone: phone.value.trim(),

                role: "customer",

                status: "active",

                emailVerified: false,

                photoURL: "",

                createdAt: serverTimestamp()

            });

            hideLoading();

            showMessage(
                "Registration successful! Please verify your email before logging in.",
                "success"
            );

            registerForm.reset();

            strengthBar.style.width = "0%";
            strengthText.textContent = "Password Strength";

            setTimeout(() => {

                window.location.href = "login.html";

            }, 2500);

        }

        catch (error) {

            hideLoading();

            console.error(error);

            let message = "Registration failed.";

            switch (error.code) {

                case "auth/email-already-in-use":
                    message = "This email is already registered.";
                    break;

                case "auth/invalid-email":
                    message = "Invalid email address.";
                    break;

                case "auth/weak-password":
                    message = "Password is too weak.";
                    break;

                case "auth/network-request-failed":
                    message = "Network error. Please check your internet connection.";
                    break;

                default:
                    message = error.message;
            }

            showMessage(message, "error");

        }

    });

}


/*==========================================================
GOOGLE SIGN-UP PLACEHOLDER

(Handled in google-auth.js)
==========================================================*/

if (googleSignup) {

    googleSignup.addEventListener("click", () => {

        window.location.href = "google-auth.html";

    });

}

/*==========================================================
AUTO REDIRECT

If a logged-in & verified customer opens register page,
redirect to dashboard.
==========================================================*/

onAuthStateChanged(auth, (user) => {

    if (user && user.emailVerified) {
        window.location.href = "customer-dashboard.html";
    }

});
/*==========================================================
END OF register.js
==========================================================*/
