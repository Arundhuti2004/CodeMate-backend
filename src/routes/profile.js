const express = require("express");
const profileRoute = express.Router();
const User = require("../models/user");
const {  userAuth } = require("../middlewares/auth");
const {validateEditFields } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


profileRoute.get("/view", userAuth, async(req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("something error" + error.message);
  }
});

profileRoute.patch("/edit" , userAuth , async (req,res) => {
    try {
        if(!validateEditFields(req)){
            throw new Error("Invalid Edit request");
            
        }
    
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save();
    
        res.json({
            message : `${loggedInUser.firstName} , your profile updated successfully` ,
            data : loggedInUser
        })
    } catch (error) {
        res.status(400).send("error :" + error.message);
        
    }

});

profileRoute.post("/forgotPassword" , async (req,res) =>{
try {
  
    const { emailId } = req.body;
    const user = await User.findOne({emailId : emailId});
  
    if(!user){
      throw new Error("user not find");
      
      
    }
  
      const token = await user.getJWT();
      res.status(200).json({
        message: "reset token sent to your email",
        resetLink: `http://localhost:3000/profile/resetPassword?token=${token}`
  
      });
} catch (error) {
  res.status(400).send("error" + error);
  
}
  
});

profileRoute.post("/resetPassword" , async (req,res) =>{
try {
    const { token , newPassword } = req.body; // destructure token from cookies
    if (!token) {
      throw new Error("Not a Vaid token !!");
    }

    //verify my token

    const deocodedObj = await jwt.verify(token, "999@Arundhuti");
    const { _id } = deocodedObj; // destructure id from decodedobj

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    const passwordHash = await bcrypt.hash(newPassword,10);
    user.password = passwordHash;
    await user.save();
    res.status(200).send("password reset successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

module.exports = profileRoute;