import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true 
    }))

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// import routers
import authRouter from './src/routes/auth.routes.js'
import healthcheckRouter from "./src/routes/healthcheck.routes.js"
import contentRouter from './src/routes/content.routes.js'
import interactionsRouter from './src/routes/likeAndComment.routes.js'
import libraryRouter from './src/routes/library.routes.js'
import followRouter from './src/routes/follow.routes.js'
import chatRouter from './src/routes/chat.routes.js'

// //routes declaration
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/content", contentRouter)
app.use("/api/v1/interactions",interactionsRouter)
app.use("/api/v1/library",libraryRouter)
app.use("/api/v1/follow",followRouter)
app.use("/api/v1/chat",chatRouter)

export { app };

