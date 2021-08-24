import Header from "./components/header.js";
import cartscreen from "./screens/cartscreen.js";
import dashboardscreen from "./screens/dashboardscreen.js";
import error404screen from "./screens/error404screen.js";
import homescreen from "./screens/homescreen.js";
import orderscreen from "./screens/orderscreen.js";
import paymentscreen from "./screens/paymentscreen.js";
import placeorderscreen from "./screens/placeorderscreen.js";
import productscreen from "./screens/productscreen.js";
import profilescreen from "./screens/profilescreen.js";
import registerscreen from "./screens/registerscreen.js";
import shippingscreen from "./screens/shippingscreen.js";
import signinscreen from "./screens/signinscreen.js";
import { hideLoading, parseRequestUrl, showLoading } from "./utils.js";


//define valid screen paths
const routes = {
    "/": homescreen,
    "/product/:id": productscreen,
    "/cart/:id": cartscreen,
    "/cart": cartscreen,
    "/signin": signinscreen,
    "/register": registerscreen,
    "/profile": profilescreen,
    "/shipping": shippingscreen,
    "/payment": paymentscreen,
    "/placeorder": placeorderscreen,
    "/order/:id": orderscreen,
    "/dashboard": dashboardscreen
};
const router = async () => {
    showLoading();
    //assign processed screen path details
    const request = parseRequestUrl();
    //construct the processed screen path, try to set to homescreen if undefined
    const parseUrl = 
        (request.resource ? `/${request.resource}` : "/") +
        (request.id ? "/:id" : "") +
        (request.action ? `/${request.action}` : "");
    //match a valid screen path, else redirect to error404
    const screen = routes[parseUrl] ? routes[parseUrl] : error404screen;
    //update dynamic header to match signin status
    const header = document.getElementById("dynamic-header");
    header.innerHTML = await Header.render();
    await Header.after_render;
    const main = document.getElementById("main-container");
    //render the appropriate screen using processed pathname
    main.innerHTML = await screen.render();
    if (screen.after_render) {
        await screen.after_render();
    };
    hideLoading();
};


window.addEventListener("load", router);
//monitor path changes
window.addEventListener("hashchange", router);

