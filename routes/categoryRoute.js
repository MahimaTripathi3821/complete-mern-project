import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authmiddleware.js';
import { createCategoryController,updateCategoryController,getAllCategoryController,getOneCategoryController,deleteCategoryController } from '../controllers/categoryController.js';
const router=express.Router()

//routes
// create-category 
router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

//update-category 
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

// get all category
router.get('/getallcategory',getAllCategoryController);

//get one category
router.get('/getonecategory/:slug',requireSignIn,isAdmin,getOneCategoryController);


//delete category
router.delete('/deletecategory/:id',requireSignIn,isAdmin,deleteCategoryController);
export default router;
