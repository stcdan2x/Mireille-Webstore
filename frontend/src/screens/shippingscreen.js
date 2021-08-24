import checkoutprogress from "../components/checkoutprogress";
import { getShippingInfo, getUserInfo, setShippingInfo } from "./localstorage";

const shippingscreen = {
    after_render: () => {
        document.getElementById("shipping-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            setShippingInfo({
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                postalCode: document.getElementById("postalCode").value,
                country: document.getElementById("country").value
            });
            document.location.hash = "/payment";
        });
    },

    render: () => {
        const { name } = getUserInfo();
        if (!name) {
            document.location.hash = "/";
        }

        const { address, city, postalCode, country } = getShippingInfo();

        return `
        ${checkoutprogress.render({ step1: true, step2: true})}
        <div class="register-form-container">
            <form id="shipping-form" class="register-form">
                <ul class="register-form__items">
                    <li>
                        <h1>Shipping Information</h1>
                    </li>
                    <li>
                        <label for="address">Address</label>
                        <input type="text" name="address" id="address" value="${address}"></input>
                    </li>
                    <li>
                        <label for="city">City</label>
                        <input type="text" name="city" id="city" value="${city}"></input>
                    </li>
                    <li>
                        <label for="postalCode">Postal Code</label>
                        <input type="text" name="postalCode" id="postalCode" value="${postalCode}"></input>
                    </li>
                    <li>
                        <label for="country">Country</label>
                        <input type="text" name="country" id="country" value="${country}"></input>
                    </li>
                    <li class="register-btn-container">
                        <button type="submit" class="primary-btn">Continue</button>
                    </li>
                </ul>
            </form>
        </div>
        `
    }
}

export default shippingscreen;