import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Chat} from "../models/aiChat.model.js"
import { request } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEM_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const getResponseFromAI = asyncHandler( async (req,res)=>{
  
    const userRequest = req.body.message;
    const result = await model.generateContent(`${userRequest}.Generate the response in only 3 lines.`);
    const response = await result.response;
    const systemResponse = response.text(); 
    
    const chat =  await  Chat.create({
        request:userRequest,
        response:systemResponse,
        owner:req.user?._id,
      });
      const createdChat = await Chat.findById(chat._id);
    if(!createdChat){
      throw new ApiError(400,"failure occured at creating chat on db!!")
    }
      
    return res
    .status(200)
    .json(new ApiResponse(200,createdChat,"Messages uploaded  successfully!!"))
});

const getAllChats = asyncHandler(async(req,res)=>{
     const userId = req.user?._id;
    //  const chats = await Chat.find({ owner: userId }).populate('owner');
     const chats = await Chat.find({ owner: userId });
     if(!chats){
        throw new ApiError(400,"failure occured at fetching chats from db!!")
     }
     return res
    .status(200)
    .json(new ApiResponse(200,chats,"Chats fetched  successfully!!"))
})

const getAllreq = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const requests = await Chat.find({ owner: userId }, 'request').exec();
    if(!requests){
       throw new ApiError(400,"failure occured at fetching requests from db!!")
    }
    return res
   .status(200)
   .json(new ApiResponse(200,requests,"requests fetched  successfully!!"))
})

export{
    getResponseFromAI,
    getAllChats,
    getAllreq
}