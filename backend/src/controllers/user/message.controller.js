import Conversation from "../../models/conversation.model.js";
import mongoose, {isValidObjectId} from "mongoose"
import Message from "../../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import {uploadOnCloudinary} from "../../utils/cloudinary.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
// import { getRecipientSocketId, io } from "../socket/socket.js";


const sendMessage =  asyncHandler( async (req, res) =>{
	
		const { recipientId, message } = req.body;
		const senderId = req.user._id;

		if(!isValidObjectId(recipientId)){
			throw new ApiError(400, "invalid recipientId!!");
		}
        if(message===""){
			throw new ApiError(400, "Can't send empty message");
		}
		
		// let { img } = req.body;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}
		if(!conversation){
			throw new ApiError(400, "Can't make new conversation");
		}
		// if (img) {
		// 	const uploadedResponse = await cloudinary.uploader.upload(img);
		// 	img = uploadedResponse.secure_url;
		// }

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			// img: img || "",
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		// const recipientSocketId = getRecipientSocketId(recipientId);
		// if (recipientSocketId) {
		// 	io.to(recipientSocketId).emit("newMessage", newMessage);
		// }

		return res.status(200).json(new ApiResponse(200, "message added to coversation", message));
	
});

const  getMessages =  asyncHandler( async (req, res)=> {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	
		const conversation = await Conversation.findOne({
			participants: { $all: [userId, otherUserId] },
		});

		if (!conversation) {
			throw new ApiError(400, "Conversation not found");
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });
		return res.status(200).json(new ApiResponse(200, "messages Found succesfully", messages));
		
	
});

const getConversations  = asyncHandler( async (req, res)=> {
	const userId = req.user._id;
	
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		return res.status(200).json(new ApiResponse(200, "conversations Found succesfully", conversations));
	
});

export { 
    sendMessage, 
    getMessages, 
    getConversations 
};