import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
// import path from path;

// app.use(express.static(path.join(__dirname, 'public')));

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())


import authRouter from './src/routes/auth.routes.js'
// import aiChatRouter from './routes/aiChat.routes.js'
// import healthcheckRouter from "./src/routes/healthcheck.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// // import commentRouter from "./routes/comment.routes.js"
// // import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"
// import videoRouter from "./routes/video.routes.js"
// import albumRouter from './routes/album.routes.js'
// import blogRouter from   './routes/blog.routes.js'
// import messageRouter from   './routes/message.routes.js'
// import watchLaterRouter  from './routes/watchLater.routes.js';
// //import tweetRouter from "./routes/tweet.routes.js"




// //routes declaration
app.use("/api/v1/auth", authRouter)
// app.use("/api/v1/chat",aiChatRouter)
// app.use("/api/v1/healthcheck", healthcheckRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// // app.use("/api/v1/comments", commentRouter)
// // app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/album", albumRouter)
// app.use("/api/v1/blog", blogRouter)
// app.use("/api/v1/message", messageRouter)
// app.use("/api/v1/watchLater", watchLaterRouter)
//app.use("/api/v1/tweets", tweetRouter)

export { app };



//routes--->

// //-->user routes
// import userRouter from "./routes/user.routes.js"
// app.use("/api/v1/users",userRouter)

// //-->video routes
// import videoRouter from "./routes/video.routes.js"
// app.use("/api/v1/videos",videoRouter)


// import commentRouter from "./routes/comment.routes.js"
// app.use("/api/v1/comment",commentRouter)