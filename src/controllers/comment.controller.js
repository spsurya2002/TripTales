import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content){
        throw new ApiError("comment can't be empty!!");
    }
    const {videoId} = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError("not a valid video!!");
    }
    const comment = await Comment.create({
        content,
        video:videoId,
        owner:req.user?._id
    })
    if(!comment){
        throw new ApiError("comment can't be added!!")
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
       comment , "comment added"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError("not a valid commentId");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"comment not found!!");
    }
    const commentorId = comment.owner;
    const userId = req.user?._id;
    if(!commentorId.equals(userId)){
        throw new ApiError(403,"not a valid commentor");
    }
    
    const {content} = req.body
    const newComment = await Comment.findByIdAndUpdate(commentId,
        { $set: { content:content } },
    {new:true});
    return res
    .status(200)
    .json(new ApiResponse(200,newComment,"comment updated!"));

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError("not a valid commentId");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"comment not found!!");
    }
    const commentorId = comment.owner;
    const userId = req.user?._id;
    if(!commentorId.equals(userId)){
        throw new ApiError(403,"not a valid commentor");
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if(!deletedComment){
        throw new ApiError(403,"something went wrong while deleting comment!!");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"comment deleted successfully!",deletedComment));

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}