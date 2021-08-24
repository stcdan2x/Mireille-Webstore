import { getProduct } from "../api";
import { parseRequestUrl, rerender } from "../utils";
import { getCartItems, setCartItems } from "./localstorage";

const addToCart = (item, forceUpdate = false) => {
    let cartItems = getCartItems();
    const itemExists = cartItems.find(x => x.prId === item.prId);
    if (itemExists) {
        if (forceUpdate) {
            cartItems = cartItems.map(x => x.prId === itemExists.prId ? item : x);
        }
    } else {
        cartItems = [...cartItems, item];
    }
    setCartItems(cartItems);

    if (forceUpdate) {
        rerender(cartscreen);
    }
}
const removeFromCart = id => {
    setCartItems(getCartItems().filter(x => x.prId !== id));
    if (id === parseRequestUrl().id) {
        document.location.hash = "/cart";
    } else {
        rerender(cartscreen);
    }
}

const cartscreen = {
    after_render: () => {
        const qtySelection = document.getElementsByClassName("qty-select");
        Array.from(qtySelection).forEach(choice => {
            choice.addEventListener("change", e => {
                const item = getCartItems().find(x => x.prId === choice.id);
                console.log(item);
                console.log(e.target.value);
                addToCart({...item, qty: Number(e.target.value)}, true);
            });
        });

        const deleteBtns = document.getElementsByClassName("del-btn");
        Array.from(deleteBtns).forEach( deleteBtn => {
            deleteBtn.addEventListener("click", () => {
                removeFromCart(deleteBtn.id);
            });
        });

        document.getElementById("checkout-btn").addEventListener("click", () => {
            document.location.hash = "/signin";
        })
    },

    render: async () => {
        const request = parseRequestUrl();
        if (request.id) {
            const product = await getProduct(request.id);
            addToCart({
                prId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                numInStock: product.numInStock,
                qty: 1,
            });
        }

        const cartItems = getCartItems();
  
        return `
        
        <div class="cart">
            <div class="cart-elems-container">
                <ul class="cart-elems">
                    <li>
                        <h3>Shopping Cart</h3>
                        <div>Price</div>
                    </li>
                    ${cartItems.length === 0 ?
                    "<div>Cart is Empty. <a href='/#/'>Go Shopping</a> </div>" :
                    cartItems.map(item => `
                    <li>
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" />
                        </div>
                        <div class="cart-item-name">
                            <div>
                                <a href="/#/product/${item.prId}">${item.name}</a>
                            </div>
                            <div>
                                Qty:
                                <select class="qty-select" id="${item.prId}">
                                    ${Array.from({length: item.numInStock}, (v, i) => i)
                                    .map( x => item.qty === x + 1
                                    ? `<option selected value="${x + 1}">${x + 1}</option>`
                                    : `<option value="${x + 1}">${x + 1}</option>`)}
                                </select>
                                <button type="button" class="del-btn" id="${item.prId}">
                                    Delete 
                                </button>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            $${item.price}
                        </div>
                    </li>
                    `
                    )
                    .join("\n")    
                    }
                </ul>
            </div>
            <div class="cart-action">
                <h3>
                    Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items)
                    :
                    $${cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
                </h3>
                <button id="checkout-btn" class="checkout-btn">
                    Proceed to Checkout
                </button>
            </div>
            

        </div>
        `;
    }
};

export default cartscreen;