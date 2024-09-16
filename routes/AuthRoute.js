import express from 'express';
import {registercontroller,logincontroller,testcontroller,forgotpasswordcontroller,updateProfileController} from '../controllers/authController.js'

import{requireSignIn,isAdmin} from '../middlewares/authmiddleware.js'
// import { requireSignIn } from '../middlewares/authmiddleware';
//router object
const router=express.Router()


//routing

//Register
router.post('/register',registercontroller)


//Login 
router.post('/login',logincontroller);


// forgot password
router.post('/forgot-password',forgotpasswordcontroller)

//testRoute
router.get('/test',requireSignIn,isAdmin,testcontroller)

//protected  user routes
router.get('/user-auth',requireSignIn,(req,res)=>{
  res.status(201).send({ok:true});
})

//protected route admin
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
res.status(201).send({ok:true})
})

//update profile
router.put('/profile',requireSignIn,updateProfileController);



export default router;