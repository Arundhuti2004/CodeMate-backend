const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://arundhuti04:Sarkar2004@cluster0.dd8u0.mongodb.net/codemate?retryWrites=true&w=majority&appName=Cluster0",
      
    );
    
  } catch (err) {
    console.error(" Database connection failed:", err.message);
  }
};

module.exports=connectDB;
