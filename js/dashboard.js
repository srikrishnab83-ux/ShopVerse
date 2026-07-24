/*==========================================================
  ShopVerse
  dashboard.js
==========================================================*/

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/*==========================================================
DOM ELEMENTS
==========================================================*/

const customerName =
    document.getElementById("customerName");

const welcomeName =
    document.getElementById("welcomeName");

const customerDistrict =
    document.getElementById("customerDistrict");

const welcomeDistrict =
    document.getElementById("welcomeDistrict");

const sidebarPhoto =
    document.getElementById("sidebarPhoto");

const userPhoto =
    document.getElementById("userPhoto");

/* Statistics */

const ordersCount =
    document.getElementById("ordersCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const cartCount =
    document.getElementById("cartCount");

const addressCount =
    document.getElementById("addressCount");

/*==========================================================
LOAD CUSTOMER
==========================================================*/

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const userRef = doc(db, "users", user.uid);

        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const data = snap.data();

        /*==========================================
        NAME
        ==========================================*/

        customerName.textContent =
            data.name || "Customer";

        welcomeName.textContent =
            data.name || "Customer";

        /*==========================================
        DISTRICT
        ==========================================*/

        customerDistrict.textContent =
            data.district || "Kerala";

        welcomeDistrict.textContent =
            data.district || "Kerala";

        /*==========================================
        PROFILE PHOTO
        ==========================================*/

        if (data.photoURL) {

            sidebarPhoto.src = data.photoURL;

            userPhoto.src = data.photoURL;

        }

        /*==========================================
        PLACEHOLDER COUNTS
        ==========================================*/

        ordersCount.textContent = "0";

        wishlistCount.textContent = "0";

        cartCount.textContent = "0";

        addressCount.textContent = "1";

    }

    catch (error) {

        console.error(error);

    }

});
/*==========================================================
LOAD DASHBOARD COUNTS
==========================================================*/

import {

    collection,
    getDocs,
    query,
    where

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        /*==========================================
        ORDERS
        ==========================================*/

        const ordersRef = collection(db, "orders");

        const ordersQuery = query(
            ordersRef,
            where("customerId", "==", user.uid)
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        ordersCount.textContent = ordersSnapshot.size;

        /*==========================================
        WISHLIST
        ==========================================*/

        const wishlistRef = collection(db, "wishlist");

        const wishlistQuery = query(
            wishlistRef,
            where("customerId", "==", user.uid)
        );

        const wishlistSnapshot = await getDocs(wishlistQuery);

        wishlistCount.textContent = wishlistSnapshot.size;

        /*==========================================
        CART
        ==========================================*/

        const cartRef = collection(db, "cart");

        const cartQuery = query(
            cartRef,
            where("customerId", "==", user.uid)
        );

        const cartSnapshot = await getDocs(cartQuery);

        cartCount.textContent = cartSnapshot.size;

        /*==========================================
        ADDRESSES
        ==========================================*/

        const addressRef = collection(db, "addresses");

        const addressQuery = query(
            addressRef,
            where("customerId", "==", user.uid)
        );

        const addressSnapshot = await getDocs(addressQuery);

        addressCount.textContent = addressSnapshot.size;

    }

    catch (error) {

        console.error("Dashboard Error:", error);

    }

});
/*==========================================================
LOGOUT
==========================================================*/

import {

    signOut

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        try {

            await signOut(auth);

            window.location.href = "../login.html";

        }

        catch (error) {

            console.error(error);

            alert("Unable to logout.");

        }

    });

}

/*==========================================================
END OF dashboard.js
==========================================================*/