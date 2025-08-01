const validator  = require("validator");
const validateSignupData = (req) =>{
    const {firstName , lastName , emailId , password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter a valid first or last name");
        
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter the valid email");

    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
        
    }
  
};







const validateEditFields = (req) =>{
    const {firstName , lastName , password , gender, skills , age , about , photoURL } = req.body;

      const isUpdateAllowed = Object.keys(req.body).every((field) =>
     validateEditFields .includes(field)
  );

  return validateEditFields;

    
  
};

 module.exports = {
        validateSignupData,
        validateEditFields
}