import { getOrder, getPaypalClientId, payOrder } from "../api";
import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils";

const addPaypalSDK = async (totalPrice) => {
    //use clientId to redirect user to Paypal website
    const clientId = await getPaypalClientId();
    showLoading();
    //set script to load Paypal and append to document body
    if (!window.paypal) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://www.paypalobjects.com/api/checkout.js";
        script.async = true;
        //define hendler to load the script
        script.onload = () => handlePayment(clientId, totalPrice);
        document.body.appendChild(script);
    } else {
        handlePayment(clientId, totalPrice);
    }
};

const handlePayment = (clientId, totalPrice) => {
    window.paypal.Button.render({ 
        env: "sandbox",
        client: {
            sandbox: clientId,
            production: ""
        },
        locale: "en_US",
        style: {
            size: "responsive",
            color: "gold",
            shape: "rect"
        },
        commit: true,
        //define payment event
        payment(data, actions) {
            //create payment record
            return actions.payment.create({
                transactions: [
                    {
                        amount: {
                            total: totalPrice,
                            currency: "USD"
                        }
                    }
                ]
            });
        },
        onAuthorize(data, actions) {
            return actions.payment.execute().then(
                async () => {
                    showLoading();
                    //call pay order
                    await payOrder(parseRequestUrl().id, {
                        orderID: data.orderID,// orderID from paypal website
                        payerID: data.payerID,
                        paymentID: data.paymentID
                    })
                    hideLoading();
                    showMessage("Payment was successful.", () => {
                        rerender(orderscreen);
                    });
                }
            );   
        }
    }, "#paypal-button").then( () => hideLoading() );
}; 

const orderscreen = {
    after_render: () => {

    },

    render: async () => {
        //get request info
        const request = parseRequestUrl();
        //get info about this order by matching request.id
        const {
            _id,
            shipping,
            payment,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isDelivered,
            isPaid,
            deliveredAt,
            paidAt
        } = await getOrder(request.id);
        if (!isPaid) {
            addPaypalSDK(totalPrice);
        }
        return `
        <div class="order-screen">
        <h1>Order Details</h1>
        <h3>Order No. ${_id}</h3>
            <div class="order">
                <div class="order-info">
                    <div>
                        <h2>Shipping</h2>
                        <div>
                            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}
                        </div>
                        ${  isDelivered
                            ? `<div class="success">Delivered: ${deliveredAt}</div>`
                            : `<div class="error">Waiting to be Delivered</div>`
                        }
                    </div>
                    <div>
                        <h2>Payment</h2>
                        <div>
                            Payment Method: ${payment.paymentMethod}
                        </div>
                        ${  isPaid
                            ? `<div class="success">Paid: ${paidAt}</div>`
                            : `<div class="error">Waiting for Payment</div>`
                        }
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
                        <li><div id="paypal-button" class="fullwidth"></div></li>      
                    </ul>
                </div>
            </div>
        </div>
        `;
    }
};

export default orderscreen;