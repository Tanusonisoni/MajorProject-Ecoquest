
import { verifyHash,generatHash } from "../Config/bcrypt.js"
import { genrateToken, verifytoken } from "../Config/jwt.js";
import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function authCantroller(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(false, null, "Email and pass require"))
        }

        // let user = await userModel.findOne({ email, isDeleted: false });
        let user = await userModel.findOne({
    email: email.trim().toLowerCase()
});
        if (!user) return res.status(404).json(new ApiResponse(false, null, "user not found"));

        user = user.toObject();

        let match = await verifyHash(password, user.password);

        if (!match) return res.status(401).json(new ApiResponse(false, null, "incprrect password"));

        let accessToken = genrateToken({
            name: user.name,
            id: user._id,
            role: user.role,
            email: user.email
        })

        delete user._v
        delete user.password

        user.accessToken = accessToken;

        res.status(200).json(new ApiResponse(true, user, "success"));
    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "inernal server error"));
    }

}

export async function adminCantrolller(req,res,next) {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(false, null, "Email and pass require"))
        }

        let user = await userModel.findOne({ email, isDeleted: false });
        if (!user) return res.status(404).json(new ApiResponse(false, null, "user not found"));

         if (user.role !== "admin") {
            return res.status(403).json(
                new ApiResponse(false, null, "Only admin can login")
            );
        }
        user = user.toObject();

        let match = await verifyHash(password, user.password);

        if (!match) return res.status(401).json(new ApiResponse(false, null, "incprrect password"));

        let accessToken = genrateToken({
            name: user.name,
            id: user._id,
            role: user.role,
            email: user.email
        })

        delete user._v
        delete user.password

        user.accessToken = accessToken;

        res.status(200).json(new ApiResponse(true, user, "success"));
    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "inernal server error"));
    }
 
}
