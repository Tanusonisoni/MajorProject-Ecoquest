
import userModel from "../models/userModel.js";
import { verifytoken } from "../Config/jwt.js";
import { ApiResponse } from "../utils/resPattern.js";

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json(
                new ApiResponse(false, null, "Unauthorized: token required")
            );
        }

        const tokenData = verifytoken(token);

        if (!tokenData) {
            return res.status(401).json(
                new ApiResponse(false, null, "Unauthorized or invalid token")
            );
        }

        const user = await userModel.findById(tokenData.id);

        if (!user) {
            return res.status(401).json(
                new ApiResponse(false, null, "User not found")
            );
        }

        if (user.isActive === false) {
            return res.status(403).json(
                new ApiResponse(false, null, "Account is inactive")
            );
        }

        if (user.isDeleted === true) {
            return res.status(403).json(
                new ApiResponse(false, null, "Account has been deleted")
            );
        }

        const userData = user.toObject();

        delete userData.password;
        delete userData.isDeleted;
        delete userData.__v;

        req.user = userData;

        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(500).json(
            new ApiResponse(false, null, "Internal server error")
        );
    }
}
