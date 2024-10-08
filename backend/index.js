//Socket connection
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { server } from './src/socket/socket.js'; // Import the server from socket.js

dotenv.config({
  path: './.env'
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION ERROR!!", err);
  });

// Without socket.io 
// // require('dotenv').config({path:'./env'})
// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import {app} from './app.js'
// dotenv.config({
//    path:'./.env'
// })
// connectDB()
// .then(()=>{
//    app.listen(process.env.PORT||8000,()=>{
//       console.log(`Server is running at ${process.env.PORT}`);
//    })
// })
// .catch((err)=>{
//    console.log("MONGODB CONNECTION ERROR!! ",err);
// })





// another method

/*
import express from "express"
const app = express()
(async ()=>{
    try{
     await mongoose.connect(`${prcess.env.MONGODB_URI}/${DB_NAME}`)
     app.on("errror",(error)=>{
        console.log("ERRR: ",error );
        throw error
     })
     app.listen(process.env.PORT,()=>{
        console.log(`App is listenning on ${process.env.PORT}`);
     })
    }catch(error){
       console.error("ERROR: ",error)
       throw err
    }
})()
*/