const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup" , async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);
    const { firstName, lastName, emailId, password , age , gender, photoUrl, skills, } = req.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      skills
    });

    await user.save(); // return the promises
    res.send("signup successfully");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    const user = await User.findOne({ emailId: emailId });
    
    

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials (no user found)" });
      console.log({photoUrl});
      
    }
    
    const isPassword = await user.validatedPassword(password);
    

    if (isPassword) {
      //create a jwt token

      // const token = await jwt.sign({ _id: user._id }, "999@Arundhuti", {
      //   expiresIn: "1d",
      // });
      

      const token = await user.getJWT();
      const userObj = user.toObject(); 
      delete userObj.password;
      

      // add the token to cookie and send the response back to the user
      res.cookie("token", token ,{ expires : new Date(Date.now() + 8 * 3600000)}) .status(200)
      .json({ user: userObj });;
      console.log("sending user from backend" , user);
      
      
    } else {
      return res.status(400).json({ error: "Invalid credentials (wrong password)" });
    }
  } catch (error) {
     res.status(500).json({ error: "Server error: " + error.message });
  }
});

authRouter.post("/logout" , async (req,res) => {
    res.cookie("token" , null , {
        expires : new Date(Date.now())
    }).send("User logout successfully")
});



module.exports = authRouter;