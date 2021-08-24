import { getMyOrders, update } from "../api";
import { hideLoading, showLoading, showMessage } from "../utils";
import { clearUser, getUserInfo, setUserInfo } from "./localstorage";


const profilescreen = {
    after_render: () => {
        document.getElementById("signout-btn")
        .addEventListener("click", () => {
            clearUser();
            document.location.hash = "/";
        });
        document.getElementById("profile-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            showLoading();
            const data = await update({
                name: document.getElementById("register-name").value,
                email: document.getElementById("register-email").value,
                password: document.getElementById("register-password").value
            });
            hideLoading();
            if (data.error) {
                showMessage(data.error);
            } else {
                setUserInfo(data);
                document.location.hash = "/";
            }
        })
    },

    render: async () => {
        const { name, email } = getUserInfo();
        if (!name) {
            document.location.hash = "/";
        }
        const orders = await getMyOrders();
        console.log(orders);
        return `

        <div class="profile">
            <div class="profile-info">  
             
                <div class="register-form-container">
                    <form id="profile-form" class="register-form">
                        <ul class="register-form__items">
                            <li>
                                <h1>User Profile</h1>
                            </li>
                            <li>
                                <label for="name">Full Name</label>
                                <input type="name" name="name" id="register-name" value="${name}"></input>
                            </li>
                            <li>
                                <label for="email">User E-mail</label>
                                <input type="email" name="email" id="register-email" value="${email}"></input>
                            </li>
                            <li>
                                <label for="password">Update Password</label>
                                <input type="password" name="password" id="register-password"></input>
                            </li>
                            <li class="register-btn-container">
                                <button type="submit" class="primary-btn">Update</button>
                            </li>
                            <li class="register-btn-container">
                                <button type="button" id="signout-btn">Sign Out</button>
                            </li>
                        </ul>
                    </form>
                </div>

            </div>
            <div class="profile-orders"> <h2>ORDER HISTORY</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0
                            ? `<tr><td colspan="6">No Order Found</td></tr>`
                            : orders.map( order => `
                                <tr>
                                    <td>${order._id}</td>
                                    <td>${order.createdAt}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>${order.paidAt || "No"}</td>
                                    <td>${order.deliveredAt || "No"}</td>
                                    <td><a href="/#/order/${order._id}">DETAILS</a></td>
                                </tr>
                            `).join("\n")}
                    </tbody>
                </table>
            </div>
        </div>

        
        `
    }
}

export default profilescreen;