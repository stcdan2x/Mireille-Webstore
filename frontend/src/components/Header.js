import { getUserInfo } from "../screens/localstorage";

const Header = {
    render: () => {
        const { name, isAdmin } = getUserInfo();
        return `
            <div class="nav__mainlogo">
                <a href="/home.html"><span>Mireille</span>Webstore</a>
            </div>
            <div class="nav__items">
            ${
                name
                ? `<a href="/#/profile" class="nav__items__1">${name}</a>`
                : `<a href="/#/signin" class="nav__items__1">Sign-In</a>`
            }    
                <a href="/#/cart" class="nav__items__2">Cart</a>
                ${isAdmin ? `<a href="/#/dashboard">Dashboard</a>` : ""}
            </div>
        `;
    },

    after_render: () => {}
}

export default Header;