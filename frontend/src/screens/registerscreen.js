import { register } from "../api";
import { hideLoading, redirectUser, showLoading, showMessage } from "../utils";
import { getUserInfo, setUserInfo } from "./localstorage";

const registerscreen = {
    after_render: () => {
        document.getElementById("register-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            showLoading();
            const data = await register({
                name: document.getElementById("register-name").value,
                email: document.getElementById("register-email").value,
                password: document.getElementById("register-password").value
            });
            hideLoading();
            if (data.error) {
                showMessage(data.error);
            } else {
                setUserInfo(data);
                redirectUser();
            }
        })
    },

    render: () => {
        /* if (getUserInfo().name) {
            document.location.hash = "/";
        } */
        return `
        <div class="register-form-container">
            <form id="register-form" class="register-form">
                <ul class="register-form__items">
                    <li>
                        <h1>Create Account</h1>
                    </li>
                    <li>
                        <label for="name">Full Name</label>
                        <input type="name" name="name" id="register-name" placeholder="John Doe"></input>
                    </li>
                    <li>
                        <label for="email">User E-mail</label>
                        <input type="email" name="email" id="register-email" placeholder="johndoe@email.com"></input>
                    </li>
                    <li>
                        <label for="password">Create New Password</label>
                        <input type="password" name="password" id="register-password"></input>
                    </li>
                    <li>
                        <label for="repassword">Re-type New Password</label>
                        <input type="password" name="repassword" id="register-repassword"></input>
                    </li>
                    <li class="register-btn-container">
                        <button type="submit" class="primary-btn">Register</button>
                    </li>
                    <li>
                        <div class="new-user">
                            <span>Already have an existing account?</span>
                            <a href="/#/signin">Login</a>
                        </div>
                    </li>
                </ul>
            </form>
        </div>
        `
    }
}

export default registerscreen;