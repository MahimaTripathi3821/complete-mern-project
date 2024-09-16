import express from 'express';
import { requireSignIn,isAdmin } from './../middlewares/authmiddleware.js';
import {createProductController,getProductController,getOneProductController,productPhotoController,deleteProductController,updateProductController,productFiltersController,productCountController,productListController,searchProductController,relatedProductController,productCategoryController
} from './../controllers/productController.js'
import formidable from 'express-formidable'
import braintree from 'braintree';
const router=express.Router();


//create products
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);


//get products
router.get('/get-product',getProductController)

//get single product
router.get('/single-product/:slug',getOneProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController);


//delete product
router.delete('/delete-product/:pid',deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);


// filter product

router.post('/product-filters',productFiltersController);

//product count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController);

// search product
router.get('/search/:keyword',searchProductController)

//similiar product
router.get('/related-product/:pid/:cid',relatedProductController);

//category wise products
router.get('/product-category/:slug',productCategoryController);

//payment routes
//token
// router.get('/braintree/token',braintreeTokenController);

//payments
// router.post('/braintree/payment',requireSignIn,braintreePaymentController)

export default router;