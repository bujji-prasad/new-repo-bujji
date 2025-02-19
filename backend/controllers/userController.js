const User = require("../model/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//verify user middleware
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }
  
    try {
      const decoded = jwt.verify(token, "PILLAGMOLLABUJJI");  // This checks if token is expired as well
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({ message: "Token expired or invalid" });
    }
  };

const createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already exists");
            return res.status(400).json({ message: "Email already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password,10)
            const newUser = new User({
                first_name,
                last_name,
                email : email.toLowerCase(),
                password : hashedPassword,
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
            });
            await newUser.save();
            res.status(200).json({ success : true ,  data : newUser , error : null});
        }
    } catch (error) {
        console.log("Error while creating the user:", error);
        return res.status(500).json({
            message: "Error while creating the user",
            errorMsg: error.message || error,
        });
    }
};
const loginUser = async (req,res) => {
    const {email,password} = req.body 
    console.log(email,password)
    try{
        const userExist = await User.findOne({email : email.toLowerCase()})
        if(!userExist){
            res.status(400).json({message : "Invalid email"})
        }
        else{
            const isPasswordMatched = await bcrypt.compare(password,userExist.password)
            if(!isPasswordMatched){
                res.status(400).json({message : "Password doenst match"})
            }
            else{
                const jwtToken = jwt.sign({id : userExist._id} , "PILLAGMOLLABUJJI" , { expiresIn: 30 })
                res.status(200).json({
                    token : jwtToken,
                    message : "User Login successfully",
                    user : {
                        first_name : userExist.first_name,
                        last_name : userExist.last_name,
                        email : userExist.email
                    }
                })
            }
        }
    }
    catch(error) {
        res.status(500).json({message : "error while login the user" , erroMessage : error.message || error})
    }
}
const getUserDetails = async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json({
        message : "successfully got singup users " , 
        users : users
      })
    } catch (err) {
      console.error('Error retrieving user details:', err);
      return res.status(500).json({ message: 'Error retrieving user details', details: err.message });
    }
  };


  const getLoginUserDetails = async (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided, please log in.' });
    }
  
    try {
      // Remove 'Bearer ' prefix
      const tokenWithoutBearer = token.replace('Bearer ', '');
      console.log('Received Token:', tokenWithoutBearer);  // Log token for debugging
  
      // Decode and verify the token
      const decoded = jwt.verify(tokenWithoutBearer, 'PILLAGMOLLABUJJI');  // Secret key used for JWT
  
      console.log('Decoded Token:', decoded);  // Log decoded token for debugging
  
      // Find the user by the ID stored in the token
      const user = await User.findById(decoded.id); 
      console.log(user)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(user.first_name)
  
      res.status(200).json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } catch (err) {
      console.error('Error retrieving user details:', err);
      return res.status(500).json({ message: 'Error retrieving user details', details: err.message });
    }
  };
  


  


module.exports = { createUser , loginUser , getUserDetails , verifyToken,getLoginUserDetails};
