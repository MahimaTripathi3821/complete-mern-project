import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import  AuthRoute from './routes/AuthRoute.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js';

//configure env
dotenv.config();


//database config
connectDB();


// Rest object
const app=express();

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))


//Routes
app.use('/api/v1/auth',AuthRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/product',productRoute);


//Rest Api
app.get('/',(req,res)=>{
  res.send('<h1>This is my ecommerce app</h1>');
})


// PORT 
const PORT=process.env.PORT ||9000;

//run listen
app.listen(PORT,()=>{
  console.log(`server started running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});

