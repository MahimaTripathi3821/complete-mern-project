import mongoose from 'mongoose';
const connectDB=async()=>{
try{
const conn=await mongoose.connect(process.env.MONGOURL)
console.log(`connected to mongoDB database ${conn.connection.host}`);
}
catch(err){
  console.log(err);
}
}
export default connectDB;
