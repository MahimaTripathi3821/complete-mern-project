import { comparePassword, hashPassword } from "../helpers/authhelper.js"
import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken';
import { message } from "antd";

export const  registercontroller=async(req,res)=>{
try{
const{name,email,password,phone,address,role,answer}=req.body;
//validations
if(!name){
  return res.send({message:'name is required'})
}
if(!email){
   return res.send({message:'email is required'})
}
if(!password){
  return  res.send({message:'password is required'})
}
if(!phone){
   return res.send({message:'phone is required'})
}
if(!address){
   return res.send({message:'address is required'})
}
if(!answer){
  return res.send({message:'answer is required'});
}

///check user
const existingUser= await userModel.findOne({email})

//existing user
if(existingUser){
  return res.status(200).send({
    success:true,
    message:'Already Register please login',
  })
}

//register user
const hashedPassword=await hashPassword(password)

//save
const user= await new userModel({name,email,phone,address,answer,role,password:hashedPassword}).save()

res.status(201).send({
  success:true,
  message:'User Registration Successfuly',
  user
})
}
catch(error){
  console.log(error);
  res.status(500).send({
    success:false,
    message:error
    
  })
}
};


// login controller
export const logincontroller=async(req,res)=>{
  try{
const{email,password}=req.body
//validations

if(!email){
  return res.send('invalid email');
}

if(!password){
  return res.send(' invalid password');
}

// check user
const user=await userModel.findOne({email})

if(!user){
return res.status(400).send('email is not registered')
}

const match=await comparePassword(password,user.password)

if(!match){
  return res.send('invalid password')
}
//token

const token=await JWT.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'});
res.status(200).send({
  success:true,
  message:'login successfuly',
  user:{
    name:user.name,
    email:user.email,
    phone:user.phone,
    address:user.address,
    role:user.role
  },
  token

})
  }
  catch(err){
console.log(err);
res.status(500).send({
  success:false,
  message:'login failed',
  err
}
)
  }
}



//Forgot password controller
 export const forgotpasswordcontroller=async(req,res)=>{
  try{
const{email,answer,newPassword}=req.body;
if(!email){
res.status(400).send({message:'Email is required'})
}
if(!answer){
res.status(400).send({message:'answer is required'})
}
if(!newPassword){
res.status(400).send({message:'newPassword is required'});
}
//check
const user=await userModel.findOne({email,answer})
//validation
if(!user){
return res.status(404).send({
  success:false,
  message:'Wrong email or Answer'
})
}
const hashed=await hashPassword(newPassword);
await userModel.findByIdAndUpdate(user._id,{password:hashed});
res.status(200).send({
  success:true,
  message:'Password Reset Successfuly'
})
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:'something went wrong',
      err
    })
  }

}


//test controller
export const testcontroller=(req,res)=>{
  res.send('protected route');
}

//update profile controller
export const updateProfileController=async(req,res)=>{
try{
const {name,email,address,phone,password}=req.body;
const user=await userModel.findById(req.user._id);

//password
if(password && password.length<6){
  return res.json({
    error:'password is required and 6 character long'
  })
}
const hashedPassword=password ? await hashPassword(password) : undefined
  const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{name:name || user.name,
    password:hashedPassword ||user.password,
    phone:phone ||user.phone,
    address:address ||user.address
  },{new:true})
  res.status(200).send({
    success:true,
    message:'profile updated successfuly',
    updatedUser
  })
}
catch(err){
  console.log(err);
  res.status(400).send({
    success:false,
    message:'error while updating the profile',
    err
  })
}
}


