import dotenv from "dotenv";

dotenv.config();

export default {
    MONGODB_URL: process.env.MONGODB_URL, //process.env is the url specified in .env file (MONGODB_URL=mongodb://localhost/dazzleshopdb)
    JWT_SECRET: process.env.JWT_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID
}