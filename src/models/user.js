const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
// create schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength : 3,
        maxlength: 50
    },
    lastName: {
        type: String,
    },
    emailId : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email :" + value );
                
            }
        }
    },
    password : {
        type: String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid Email :" + value );
                
            }
        }
    },
    age : {
        type : Number,
        min : 18
        
    },
    gender: {
        type: String,
        validate(value){
             if(!["male" , "female" , "others"].includes(value)){
                throw new Error("Gender data is not valid");
           }
        }


        
    },
    photoUrl: {
        type : String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photourl:" + value );
                
            }
        }
    },
    about : {
        type : String,
        default : "Here write about yourself"
    },
    skills : {
        type : [String]
    },
},

{
    timestamps : true,
}

);

userSchema.index({firstName : 1 , lastName : 1});


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "999@Arundhuti", {
        expiresIn: "1d",
      });

      return token;
    }

    userSchema.methods.validatedPassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    console.log(passwordInputByUser);
    
    const isPassword =  await bcrypt.compare(passwordInputByUser, passwordHash);
      

      return isPassword;
    }


//define new model

const User = mongoose.model("User", userSchema);

// create model 

module.exports = User;