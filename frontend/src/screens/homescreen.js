import axios from "axios";
import rating from "../components/rating";
import { hideLoading, showLoading } from "../utils";


const homescreen = {

    //populate screen with product items with dynamic data from backend server
    render: async () => {
        showLoading();
        // set http request to get all product data from server
        const response = await axios({
            url: "http://localhost:5000/api/products",
            headers: {
                "Content-Type": "application/json",
            },
        });
        hideLoading();
        if(!response || response.statusText !== "OK") {
            return `<div>Error in retrieving data</div>`;
        }
        const products = response.data;

        return `
        
        <ul class="products">
        ${products.map(product => `
            <li class="products__container">
                <div class="products__product">
                    <a href="/#/product/${product._id}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <div class="products__product-desc">
                        <a href="/#/product/${product._id}">
                            ${product.name}
                        </a>
                    </div>
                    <div class="products__product-rating">
                        ${rating.render({
                            value: product.rating,
                            text: `${product.numReviews} reviews`
                        })}
                    </div>
                    <div class="products__product-brand">
                        ${product.brand}
                    </div>
                    <div class="products__product-price">
                        $${product.price}
                    </div>
                </div>
            </li>
        `).join("\n")}
        </ul>
        `;

        /* const ul = document.querySelector(".products");
        let populate = "";
        for (let product of products) {
            populate += `<li class="products__container">
            <div class="products__product">
                <a href="/#/product/${product._id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="products__product-desc">
                    <a href="/#/product/${product._id}">
                        ${product.name}
                    </a>
                </div>
                <div class="products__product-brand">
                    ${product.brand}
                </div>
                <div class="products__product-price">
                    $${product.price}
                </div>
            </div>
        </li>`;
        }
        ul.innerHTML = populate; */
    }
};
export default homescreen;