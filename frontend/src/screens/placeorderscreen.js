import { createOrder } from "../api";
import checkoutprogress from "../components/checkoutprogress";
import { hideLoading, showLoading, showMessage } from "../utils";
import { clearCart, getCartItems, getPaymentInfo, getShippingInfo } from "./localstorage"


const collectOrderInfo = () => {
    const orderItems = getCartItems();
    if (orderItems.length === 0) {
        document.location.hash = "cart";
    }
    const shipping = getShippingInfo();
    if (!shipping.address) {
        document.location.hash = "/shipping";
    }
    const payment = getPaymentInfo();
    if (!payment.paymentMethod) {
        document.location.hash = "/payment";
    }
    const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
    return {
        orderItems,
        shipping,
        payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    };
};

const placeorderscreen = {
    after_render: async () => {
        document.getElementById("placeorder-btn")
        .addEventListener("click", async () => {
            const order = collectOrderInfo();
            showLoading();
            const data = await createOrder(order);
            hideLoading();
            if(data.error) {
                showMessage(data.error);
            } else {
                //clear all items from the cart after completing an order
                clearCart();
                document.location.hash = `/order/${data.order._id}`;
            };
        });
    },

    render: () => {
        const {
            orderItems,
            shipping,
            payment,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        } = collectOrderInfo();
        return `
        <div>
            ${checkoutprogress.render({ step1: true, step2: true, step3: true, step4: true })}
            <div class="order">
                <div class="order-info">
                    <div>
                        <h2>Shipping</h2>
                        <div>
                            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}
                        </div>
                    </div>
                    <div>
                        <h2>Payment</h2>
                        <div>
                            Payment Method: ${payment.paymentMethod}
                        </div>
                    </div>
                    <div>
                        <ul class="cart-elems">
                            <li>
                                <h2>Shopping Cart</h2>
                                <div>Price</div>
                            </li>
                            ${orderItems.map((item) => `
                            <li>
                                <div class"cart-item-image">
                                    <img src="${item.image}" alt="${item.name}" />
                                </div>
                                <div class="cart-item-name">
                                    <div>
                                        <a href="/#/product/${item.prId}">${item.name}</a>
                                    </div>
                                    <div> Qty: ${item.qty} </div>
                                </div>
                                <div class="cart-item-price">$${item.price}</div>
                            </li>
                            `).join("\n")}
                        </ul>
                    </div>
                </div>
                <div class="order-action">
                    <ul>
                        <li>
                            <h2>Order Summary</h2>
                        </li>
                        <li><div>Items</div><div>$${itemsPrice}</div></li>
                        <li><div>Shipping</div><div>$${shippingPrice}</div></li>
                        <li><div>Tax</div><div>$${taxPrice}</div></li>
                        <li class="total"><div>Order Total</div><div>$${totalPrice}</div></li>      
                    </ul>
                    <button id="placeorder-btn" class="primary-btn fullwidth">Place Order</button>
                </div>
            </div>
        </div>
        `;
    }
};

export default placeorderscreen;