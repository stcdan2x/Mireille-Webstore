import express from "express";
import User from "../models/userModel";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAuth } from "../utils";

const userRouter = express.Router();

userRouter.get("/createadmin", 
    //handle all errors that may arise from async functions (ajax requests)
    //to avoid application halt when errors occur
    expressAsyncHandler(async (req , res) => {
        try {
            //manually and directly create a user as admin account
            const user = new User({
                name: "Admin One",
                email: "admin@dazzlingsky.com",
                password: "lakastops",
                isAdmin: true
            });
            //save the new user to database
            const createdUser = await user.save();
            res.send(createdUser);
        } catch (err) {
                res.status(500).send({message: err.message});
        }
    })
);

userRouter.post("/signin", 
    expressAsyncHandler(async (req, res) => {
        //lookup database for email and password that matches the user's form input
        const signinUser = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });
        //if if the credentials from user input matches data in the database
        //respond with corresponding data and generate a token for access
        if (!signinUser) {
            res.status(401).send({
                message: "Invalid User E-mail or Password"
            });
        } else {
            res.send({
                _id: signinUser._id,
                name: signinUser.name,
                email: signinUser.email,
                isAdmin: signinUser.isAdmin,
                token: generateToken(signinUser)
            });
        }
    })
);

userRouter.post("/register", 
    expressAsyncHandler(async (req, res) => {
        //create a new account by passing data from user's form input
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        //save the data of the newly created account and if it is successful, 
        //send back (respond with) data including database-assigned id and generated
        //token for access to login automatically after account creation
        const createdUser = await user.save();
        if (!createdUser) {
            res.status(401).send({
                message: "Invalid or Insufficient Data"
            });
        } else {
            res.send({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                token: generateToken(createdUser)
            });
        }
    })
);

//define new route for updating user profile and authenticate before processing
userRouter.put("/:id", isAuth,//authenticate user request using Bearer Token validation
    expressAsyncHandler(async (req, res) => {
        //get user account data from database
        const user = await User.findById(req.params.id); // req.params.id is "/:id"
        if (!user) {
            res.status(404).send({
                message: "User does not exist"
            });
        } else {
            //update user info using user input otherwise, use existing info in database if none is supplied
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;
            //update database
            const updatedUser = await user.save();
            res.send({
                //pass info to frontend and generate new token based on it
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser)
            });
        }
    })
);

export default userRouter;