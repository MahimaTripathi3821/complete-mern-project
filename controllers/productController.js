import ProductModel from "../models/ProductModel.js";
import fs from 'fs';
import slugify from 'slugify';
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js"

// import { bodyParser } from 'body-parser';
//payment gateway


export const createProductController=async(req,res)=>{
try{
  const {name,description,slug,category,quantity,price,shipping}=req.fields;
  const {photo}=req.files;

  //validations
switch(true){
  case !name:
    return res.status(500).send({error:'name is required'});
    case !description:
      return res.status(500).send({error:'Description is required'});
      case !price:
        return res.status(500).send({error:'price is required'});
        case !category:
          return res.status(500).send({error:'category is required'});
          case !quantity:
            return res.status(500).send({error:'quantity is required'});
            case photo && photo.size  > 1000000:
              return res.status(500).send({error:'photo is required and could be less than 1mb'})
}

const products=new  ProductModel({...req.fields,slug:slugify(name)});
if(photo){
  products.photo.data=fs.readFileSync(photo.path)
  products.photo.contentType=photo.type
}
else{
  console.log('photo is not valid');
}
await products.save()
res.status(201).send({
  success:true,
  message:'Product created successfuly',
  products,
 totalcount:products.length,
})
}
catch(err){
  console.log(err);
  res.status(500).send({
    success:false,
    message:"error occuring while create the product",
    err

  })
}


}

export const getProductController=async(req,res)=>{
try{
const products=await ProductModel.find({}).select("-photo").limit(12).sort({createdt:-1})
res.status(200).send({success:true,
  message:"All products",
  products 
})
}
catch(err){
  console.log(err);
  res.status(500).send({
    success:false,
    message:"error in getting  the products",
    err
})
}
}

//Get one product 
export const getOneProductController=async(req,res)=>{
try{
const product=await ProductModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
res.status(200).send({success:true,
  message:"Single product",
  product
})
}
catch(err){
  console.log(err);
  res.status(500).send({
    success:false,
    message:"error while  getting  single product",
    err
}
  )
}
}

//get product photo

export const productPhotoController=async(req,res)=>{
try{
const product=await ProductModel.findById(req.params.pid).select("photo")
if(product?.photo?.data){
  res.set('Content-type',product.photo.contentType)
  return res.status(200).send(product?.photo.data
  )
}
}
catch(err){
  console.log(err);
  res.status(500).send({
    success:false,
    message:"error while  getting product photo",
    err
}
  )
}
}

//delete product 
export const deleteProductController=async(req,res)=>{
  try{
await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
res.status(200).send({
  success:true,
  message:'product deleted successfuly'
})
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:"error while  getting product photo",
      err
  }
)
}
}


// update product

export const updateProductController=async(req,res)=>{

  try{
    const { name,description,category,quantity,price}=req.fields;
    const {photo}=req.files;
  
    //validations
  switch (true) {
    case !name:
      return res.status(500).send({error:'name is required'});
      case !description:
        return res.status(500).send({error:'Description is required'});
        case !price:
          return res.status(500).send({error:'price is required'});
          case !category:
            return res.status(500).send({error:'category is required'});
            case !quantity:
              return res.status(500).send({error:'quantity is required'});
              case photo && photo.size  > 1000000:
                return res.status(500).send({error:'photo is required and could be less than 1mb'})
  }
  
  const products=await ProductModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true});
  if(photo){
    products.photo.data=fs.readFileSync(photo.path)
    products.photo.contentType=photo.type
  }
  else{
    console.log('photo is not valid');
  }
  await products.save()
  res.status(201).send({
    success:true,
    message:'Product updated successfuly',
    products,
   totalcount:products.length,
  })
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:"error occuring while updating the product",
      err
  
    })
  }
 
}

// filters 
export const productFiltersController=async(req,res)=>{
try{
const {checked,radio}=req.body
let args={}
if(checked.length >0) args.category=checked
if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
const products=await ProductModel.find(args)
res.status(200).send({
  success:true,
  products
});
}
catch(err){
  console.log(err);
  res.status(400).send({
    success:false,
    message:'Error while filtering products',
    err
  })
}
}

// product count
 export const productCountController=async(req,res)=>{
  try{
const total=await ProductModel.find({}).estimatedDocumentCount();
res.status(200).send({
  success:true,
  total
})
  }
  catch(err){
console.log(err);
res.status(400).send({
  success:false,
  message:'error in product-count',
  err
})
  }
 }

 //product-list controller
 export const productListController=async(req,res)=>{
  try{
      const perpage=6;
      const page=req.params.page ? req.params.page:1;
      const products=await ProductModel.find({}).select('-photo').skip((page-1)*perpage).limit(perpage).sort({createdAt:-1})
      res.status(200).send({
        success:true,
        products
      })
  }
  catch(err){

  }
 }
 export const searchProductController=async(req,res)=>{
  try{
const {keyword}=req.params
const result=await ProductModel.find({
  $or:[
    {name:{$regex :keyword,$options:'i'}},
    {description:{$regex :keyword,$options:'i'}}
  ]
  }).select("-photo")
res.json(result);
}
  catch(err){
    console.log(err);
    res.status(400).send({
      success:false,
      message:'Error in search product API'
    })
  }
 }

 // related product controller
 export const relatedProductController=async(req,res)=>{
try{
const{pid,cid}=req.params
const products=await ProductModel.find({
  category:cid,
  _id:{$ne:pid}
}).select("-photo").limit(3).populate("category");
res.status(200).send({
  success:true,
  products
})
}
catch(err){
  console.log(err);
  res.status(400).send({
    success:false,
    message:'error while getting the related products'
  })
}
 }

 // product category controller
 export const productCategoryController=async(req,res)=>{
  try{
const category=await categoryModel.find({slug:req.params.slug});
const products=await ProductModel.find({category}).populate('category');
res.status(200).send({
  success:true,
  category,
  products
})
  }
  catch(err){
console.log(err);
res.status(400).send({
  success:false,
  message:'error while getting product according to the category',
  err
})
  }
 }

 