import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



export const signup = async (req,res)=>{
    const { fullName, email , password} = req.body
    try {
        if (!fullName || !email || !password){
            return res.status(400).json({message: "All field must be filled"})
        }
        //Hash Password
        if(password.length <6){
            return res.status(400).json({
                message:"Password must be atleast of 6 letters"
            })
        }
           //Checking if User exists or not
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message: "Email Already exists"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        
        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })

        if(newUser){
            //GenrateToken here
            genrateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            })

        }

        else{
            res.status(400).json({message:"Invalid User Data"});
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
      res.status(500).json({message: "Internal Server Error"});
        
    }

}
export const login = async (req,res)=>{
    const { email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        genrateToken(user._id,res)
        res.status(200).json({
         _id: user.email,
         fullName: user.fullName,
         email: user.email,
        })
    } catch (error) {
       console.log("Error in login controller", error.message);
    return res.status(500).json({message: "Internal server error"});
 
    }

    
}
export const logout = async (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({
            message: "Logout Successfully"
        });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({message: "Internal server error"});

        
    }
    
}

export const checkAuth = async (req,res)=>{
    
}