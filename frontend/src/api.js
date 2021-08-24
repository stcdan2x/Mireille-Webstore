import axios from "axios"
import { apiUrl } from "./config";
import { getUserInfo } from "./screens/localstorage";

// setup request from the browser to the server to get actual product data from backend
export const getProduct = async (id) => {
    try {
        const config = {
            url: `${apiUrl}/api/products/${id}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        let response = await axios(config);
        if (response.statusText !== "OK") {
            console.log(response);
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message };
    }
};

export const signin = async ({ email, password }) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/users/signin`,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: { email, password }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message};
    }
};

export const register = async ({ name, email, password }) => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/users/register`,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            data: { name, email, password }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message};
    }
};

export const update = async ({ name, email, password }) => {
    try {
        const { _id, token} = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/users/${_id}`,
            method: "PUT",
            headers: {"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`},    
            data: { name, email, password }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        console.log(err);
        return { error: err.response.data.message || err.message};
    }
};

export const createOrder = async order => {
    try {
        const {token} = getUserInfo();
        const response = await axios ({
            url: `${apiUrl}/api/orders`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: order
        });
        if (response.statusText !== "Created") {
            throw new Error(response.data.message);
        }
        console.log(response);
        return response.data;
    } catch (err) {
        return { error: err.response ? err.response.data.message : err.message };
    }

};

export const getOrder = async (id) => {
    try {
        const { token } = getUserInfo();
        const response = await axios ({
            url: `${apiUrl}/api/orders/${id}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        return { error: err.message };
    }
};

export const getPaypalClientId = async () => {
    try {
        const response = await axios({
            url: `${apiUrl}/api/paypal/clientId`,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }  
        return response.data.clientId;  
    } catch (err) {
        return { error: err.message };
    }
};


export const payOrder = async (orderId, paymentResult) => {
    try {      
        //inform backend server that this order is paid
        const { token } = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/orders/${orderId}/pay`,
            method: "PUT",
            headers: {
                 "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: paymentResult
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        return { error: err.response ? err.response.data.message : err.message };
    }
};

export const getMyOrders = async () => {
    try {
        const { token } = getUserInfo();
        const response = await axios ({
            url: `${apiUrl}/api/orders/myorders`,
            headers: {
                 "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }    
        });
        if (response.statusText !== "OK") {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (err) {
        return { error: err.response ? err.response.data.message : err.message };
    }
};

export const getSummary = async () => {
    try {
        const { token } = getUserInfo();
        const response = await axios({
            url: `${apiUrl}/api/orders/summary`,
            headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
            },
        });
        if (response.statusText !== 'OK') {
            throw new Error(response.data.message);
        } else {
            return response.data;
        }
    } catch (err) {
      return { error: err.response ? err.response.data.message : err.message };
    }
  };