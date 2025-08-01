const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // destructure token from cookies
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
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
 
  userAuth,
};
