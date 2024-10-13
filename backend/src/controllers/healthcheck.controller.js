import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    res.status(201).json(
        new ApiResponse(200, "ALL OK!")
    )
})

export {
    healthcheck
    }
    