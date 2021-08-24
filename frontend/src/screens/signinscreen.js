import { signin } from "../api";
import { hideLoading, redirectUser, showLoading, showMessage } from "../utils";
import { getUserInfo, setUserInfo } from "./localstorage";

const signinscreen = {
    after_render: () => {
        document.getElementById("signin-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            showLoading();
            const data = await signin({
                email: document.getElementById("signin-email").value,
                password: document.getElementById("signin-password").value
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
        if (getUserInfo().name) {
            redirectUser();
        }
        return `
        <div class="signin-form-container">
            <form id="signin-form" class="signin-form">
                <ul class="signin-form__items">
                    <li>
                        <h1>Sign-In</h1>
                    </li>
                    <li>
                        <label for="email">User E-mail</label>
                        <input type="email" name="email" id="signin-email" placeholder="johndoe@email.com"></input>
                    </li>
                    <li>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="signin-password"></input>
                    </li>
                    <li class="signin-btn-container">
                        <button type="submit" class="primary-btn">Sign-in</button>
                    </li>
                    <li>
                        <div class="new-user">
                            <span>New User?</span>
                            <a href="/#/register"> Create your account</a>
                        </div>
                    </li>
                </ul>
            </form>
        </div>
        `
    }
}

export default signinscreen;