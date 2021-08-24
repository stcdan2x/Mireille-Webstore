import { getProduct } from "../api";
import rating from "../components/rating";
import { hideLoading, parseRequestUrl, showLoading } from "../utils";

const productscreen = {

    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById("addtocart-btn").addEventListener("click", () => {
            document.location.hash = `/cart/${request.id}`;
        });
    },

    render: async () => {
        const request = parseRequestUrl();
        showLoading();
        // refer to request setup to get data from server
        const product = await getProduct(request.id);
        hideLoading();
        if (product.error) {
            return `<div>${product.error}</div>`;
        }
        return `<div class="productscreen-container">
                    <div class="back-to-result-link">
                        <a href="/#/">Back to results</a>
                    </div>
                    <div class="product-details">
                        <div class="product-details__image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-details__info">
                            <ul>
                                <li><h1>${product.name}</h1></li>
                                <li>
                                    ${rating.render({
                                    value: product.rating,
                                    text: `${product.numReviews} reviews`
                                })}
                                </li>
                                <li class="product-details__price">Price: $${product.price}</li>
                                <li>
                                    <div>Description:</div>
                                </li>
                                <li class="desc-text">
                                    <div>${product.description}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="product-details__action">
                            <ul>
                                <li class="order-price">$${product.price}</li>
                                <li>Status:
                                        ${product.numInStock > 0
                                            ? `<span class="product-details__in-stock">In Stock</span>`
                                            : `<span class="product-details__error">Out of Stock</span>`}
                                </li>
                                <li>
                                    <button class="primary-btn" id="addtocart-btn">Add to Cart</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>`;
    }
};

export default productscreen;