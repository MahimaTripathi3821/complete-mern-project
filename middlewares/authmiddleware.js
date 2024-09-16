import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import AuthRoute from '../routes/AuthRoute.js';

//protected routes token based
export const requireSignIn=async(req,res,next)=>{

  try{
    const decode=JWT.verify(req.headers.authorization,process.env.SECRET_KEY);
    req.user=decode;
    next()
  }
  catch(err){
    console.log(err);
  }
  

}

//admin access
export const isAdmin=async(req,res,next)=>{
  try{
const user=await userModel.findById(req.user._id)
if(user.role !=1){
return res.status(401).send({
  sucess:false,
  message:'UnAuthorized Access'
})
}
else{
  next();
}
  }
  catch(err){
    console.log(err);
res.status(500).send({
  message:err
})
  }
}