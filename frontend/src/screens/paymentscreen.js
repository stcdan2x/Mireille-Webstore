import checkoutprogress from "../components/checkoutprogress";
import { getUserInfo, setPaymentInfo } from "./localstorage";

const paymentscreen = {
    after_render: () => {
        document.getElementById("payment-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const paymentMethod = document.querySelector(
                "input[name='payment-method']:checked"
            ).value;    
            setPaymentInfo({ paymentMethod });
            document.location.hash = "/placeorder";
        });
    },

    render: () => {
        const { name } = getUserInfo();
        if (!name) {
            document.location.hash = "/";
        }
        return `
        ${checkoutprogress.render({ step1: true, step2: true, step3: true })}
        <div class="register-form-container">
            <form id="payment-form" class="register-form">
                <ul class="register-form__items">
                    <li>
                        <h1>Payment</h1>
                    </li>
                    <li>
                        <div>
                            <input type="radio" name="payment-method" id="paypal" value="Paypal" checked>Paypal</input>
                            <label for="paypal"></label>
                        </div>
                    </li>
                    <li>
                        <div>
                            <input type="radio" name="payment-method" id="stripe" value="Stripe">Stripe</input>
                            <label for="stripe"></label>
                        </div>
                    </li>
                    <li class="register-btn-container">
                        <button type="submit" class="primary-btn full">Continue</button>
                    </li>
                </ul>
            </form>
        </div>
        `
    }
}

export default paymentscreen;