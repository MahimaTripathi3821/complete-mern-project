import categoryModel from "../models/categoryModel.js";
import slugify from 'slugify';
export const createCategoryController=async(req,res)=>{
try{
const {name}=req.body;

//validations
if(!name){
return res.status(401).send({message:'name is required'});
}
const existingCategory=await categoryModel.findOne({name});
if(existingCategory){
  return res.status(200).send({
    success:true,
    message:'category Already exists'
  })
}
const category=await new categoryModel({name,slug:slugify(name)}).save();
res.status(201).send({
  success:true,
  message:'new category created',
  category
})


}
catch(err){
  console.log(err);
  res.status(500).send({
    success:false,
    message:'error in category',
    err
  })
}
}
export const updateCategoryController=async(req,res)=>{
  try{
    const {name}=req.body
    const {id}=req.params
const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
res.status(200).send({
  success:true,
  message:'category updated successfuly',
  category
})
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:'error while updating  category',
      err
    })
  }
}

//get all category controllers
export const getAllCategoryController=async(req,res)=>{
  try{
const category=await categoryModel.find({});
res.status(200).send({
  success:true,
  message:'All Categories List',
  category
})

  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      err,
      message:'error while getting all categories of the products'
    })
  }
}

//getOneCategoryController

export const getOneCategoryController=async(req,res)=>{
  try{
const category=await categoryModel.findOne({slug:req.params.slug});
res.status(200).send({
  success:true,
  message:'Get single category successfuly',
  category
})
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      err,
      message:'error  occuring while getting one category'
    })
  }
}

//delete category
export const deleteCategoryController=async(req,res)=>{
  try{
const {id}=req.params;
 const category=await categoryModel.findByIdAndDelete(id);
res.status(200).send({
  success:true,
  message:'category deleted successfuly',
category
})
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      err,
      message:'error  occuring while getting one category'
    })
  }
}