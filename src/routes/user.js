const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const { populate } = require("../models/user");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";


userRouter.get("/requests/recieved" , userAuth , async(req , res) =>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId" , USER_SAFE_DATA);

        if(connectionRequests){
            return res.status(200).send({
                connectionRequests,
            })

        }


    } catch (error) {
        return res.status(400).json("ERROR")
        
    }
})

userRouter.get("/connection" , userAuth , async (req,res) =>{
    try {
        const loggedInUser = req.user;
        console.log(loggedInUser);

        const connectionRequests = await connectionRequestModel.find({
            $or: [
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"}
            ],
        }).populate("fromUserId toUserId" , USER_SAFE_DATA);

        const data = connectionRequests.map((row) =>{
            if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                return row.toUserId;
            }

            return row.fromUserId;
        });
        res.status(200).json({
            data,
        });
        
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
        
    }
})


userRouter.get("/feed" , userAuth , async (req,res) =>{
    try {
        const loggedInUser  = req.user;
        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10);

        limit = limit > 50 ? 50 : limit ;
        const skip = (page - 1) * limit;

        const connectionRequests = await connectionRequestModel.find({
            $or:[
                { fromUserId : loggedInUser._id } , {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) =>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());

        });


        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);

    } catch (error) {
        res.status(400).send("ERROR" + error.message);
    }
})

module.exports = userRouter;