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

// import routers
import authRouter from './src/routes/auth.routes.js'
import healthcheckRouter from "./src/routes/healthcheck.routes.js"
import contentRouter from './src/routes/content.routes.js'
import interactionsRouter from './src/routes/interactions.routes.js'
import libraryRouter from './src/routes/library.routes.js'

// //routes declaration
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/content", contentRouter)
app.use("/api/v1/interactions",interactionsRouter)
app.use("/api/v1/library",libraryRouter)

export { app };

