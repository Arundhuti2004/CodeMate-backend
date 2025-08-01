const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(cors({
  origin: "http://localhost:5173",
  credentials : true
}));
app.use(express.json());
app.use(cookieParser()); // middleware


const authRouter = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")


app.use("/", authRouter);
app.use("/profile" , profileRoute);
app.use("/request" , requestRouter);
app.use("/user", userRouter);







// app.get("/user",userAuth, async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const users = await User.findOne({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("user not found");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.delete("/user",userAuth, async (req, res) => {
//   const userId = req.body._id;
//   try {
//     const users = await User.findByIdAndDelete(userId);

//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong" + error.message);
//   }
// });

// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});

//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/user",userAuth, async (req, res) => {
//   const userId = req.body._id;
//   const data = req.body;
//   delete data._id;
//   const ALLOWED_UPDATES = [
//     "firstName",
//     "lastName",
//     "gender",
//     "skills",
//     "age",
//     "about",
//     "photoURL",
//     "password",
//   ];

//   const isUpdateAllowed = Object.keys(data).every((k) =>
//     ALLOWED_UPDATES.includes(k)
//   );

//   try {
//     if (!isUpdateAllowed) {
//       throw new Error("update Not Allowed");
//     }

//     const users = await User.findOneAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong" + error.message);
//   }
// });



connectDB()
  .then(async () => {
    console.log("Database connection successfully...");
    app.listen(3000, () => {
      console.log("server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected...");
  });
