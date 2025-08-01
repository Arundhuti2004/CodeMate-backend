const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const toUser = await User.findById(toUserId);
    console.log("touser", toUser);

    if (!toUser) {
      return res.status(404).json({
        message: " user not found",
      });
    }

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" + status });
    }

    //if there is an existing connectionRequest
    const existingConnectionRequest = await connectionRequestModel.findOne({
      $or: [
        { fromUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    console.log("request", existingConnectionRequest);
    if (existingConnectionRequest) {
      throw new Error("Already sent the connection request before");
    }

    const connectionReq = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReq.save();

    res.json({
      message: user.firstname + "is" + status + "in" + toUser.firstName,
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

requestRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status or Status not allowed",
          success: false,
        });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id : requestId,
        toUserId : loggedInUser._id,
        status : "interested"
      });

      if(!connectionRequest){
        return res.status(404).json({
          message: "user not found",
          success : false,
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: "Connection request" + status,
        data,
        success: true,
      });
    } catch (error) {
      res.status(400).send("ERROR:" + error.message);
    }
  }
);

module.exports = requestRouter;
