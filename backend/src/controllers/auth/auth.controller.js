import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {User} from "../../models/auth/user.model.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async function(userId){
       try {
       const user =  await User.findById(userId);
       const accessToken =  user.generateAccessToken();
       const refreshToken =  user.generateRefreshToken();
      
       user.refreshToken = await refreshToken;
       user.save({validateBeforeSave: false});

       return {accessToken,refreshToken};


       } catch (error) {
        throw new ApiError(500,"something went wrong while generating referesh and access token")
       }
}

const registerUser = asyncHandler( async (req,res)=>{
  /*
     1. get user details from frontend
     2. validation -not empty
     3.check prior existance of user by email or username
     4.check for images and avatar -->upload them to cloudinary-->check avatar
     5.create user object-create entry in db
     6.remove password and refresh token field
     7.check for user creation
     8. return respose
   */
    //input data 
    const {username,fullName,email,password}=req.body

    //validation for empty field
    if(
        [username,fullName,email,password].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"full name is required")
    }
    //validation for existense correct email
     /*-------------------------------------*/

    //validation for existense of user
  const existedUser = await User.findOne({
      $or:[{ username }, { email }]
    })
    if(existedUser){
      throw new ApiError(409,"User  already exists!!")
    }
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
    }
    // //check for avatar
    
    if (!avatarLocalPath) {
      throw new ApiError(400,"Avatar file is required")
    }
    // //upload them to cloudinary
    console.log("surya-->"+avatarLocalPath);
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("surya-->"+avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
      throw new ApiError(400,"failure occured at upload on cloudinary!!")
    }
   
    // create user object and upload in db
    const user =  await  User.create({
      fullName,
      username:username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
      coverImage:coverImage?.url||"",
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User created Successfully")
  )
})  

const loginUser = asyncHandler( async (req,res)=>{
  /*
  input username (or email) and password from req body
  check existense of user in database
  validate the password with username/email
  if valid then give then send access and refresh token cookies
  */
  
  const {username ,email , password}=req.body;
  // console.log(username,email);
  if(!username && !email){
    throw new ApiError(400,"username or email is required")
  }
   const user = await User.findOne({
    $or:[{username},{email}]
   })

   if(!user){
    throw new ApiError(404,"user does not exist");
   }
   const isPasswordvalid = await user.isPasswordCorrect(password);
   if(!isPasswordvalid){
    throw new ApiError(401,"password is incorrect!!")
   }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
  

})

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if (!user) {
          throw new ApiError(401, "Invalid refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
          
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken, refreshToken: newRefreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
  
  const {oldPassword, newPassword} = req.body

  

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async(req,res)=>{

  return res
  .status(200)
  .json(new ApiResponse(200, req.user , "user details are here!"))

})

const updateAccountDetails = asyncHandler( async (req,res)=>{
        
    const {fullName,email} = req.body;
    
    if(!(fullName&&email)) {
      throw new ApiError(400,"all fields are required!!");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          fullName:fullName,
          email:email
        }
      },
      {new:true}

    ).select("-password");
    // console.log(user);
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Updated account details!!"))

})
const completeProfile = asyncHandler( async (req,res)=>{
  // to complete user's information for profile

  // const {bio,} = req.body;
  
  // if(!(fullName&&email)) {
  //   throw new ApiError(400,"all fields are required!!");
  // }
  // const user = await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     $set:{
  //       fullName:fullName,
  //       email:email
  //     }
  //   },
  //   {new:true}

  // ).select("-password");
  // // console.log(user);
  // return res
  // .status(200)
  // .json(new ApiResponse(200,user,"Updated account details!!"))

})

const updateAvatar = asyncHandler( async (req,res)=>{
      
      const avatarLocalPath = req.file?.path

      if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
      }
      const avatar =   await uploadOnCloudinary(avatarLocalPath); 
      if(!avatar){
        throw new ApiError(400,"Error while uploading avatar");
      }

      const userDetail =await  User.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
            avatar:avatar.url
          }
        },
        {new:true}
  
      ).select("-password");

      
      return res
      .status(200)
      .json(new ApiResponse(200,userDetail,"avatar updated  successfully!!"))
      
})

const updateCoverImage = asyncHandler( async (req,res)=>{
      
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400,"coverImage file is missing");
  }
  const coverImage =   await uploadOnCloudinary(coverImageLocalPath); 
  if(!coverImage){
    throw new ApiError(400,"Error while uploading coverImage");
  }

  const userDetail = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}

  ).select("-password");

  
  return res
  .status(200)
  .json(new ApiResponse(200, userDetail,"coverImage updated  successfully!!"))
  
})
// update bio
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  completeProfile
}