
import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js";

// Get logged-in student's profile
export async function getStudentProfile(req, res, next) {
    try {
        const studentId = req.user?._id || req.user?.id;

        if (!studentId) {
            return res.status(401).json(
                new ApiResponse(false, null, "Authentication required")
            );
        }

        const student = await userModel.findOne({
            _id: studentId,
            role: "student"
        }).select("name email role status createdAt");

        if (!student) {
            return res.status(404).json(
                new ApiResponse(false, null, "Student not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(true, student, "Profile fetched successfully")
        );
    } catch (error) {
        next(error);
    }
}

// Update logged-in student's name
export async function updateStudentProfile(req, res, next) {
    try {
        const studentId = req.user?._id || req.user?.id;
        const { name } = req.body;

        if (!studentId) {
            return res.status(401).json(
                new ApiResponse(false, null, "Authentication required")
            );
        }

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json(
                new ApiResponse(false, null, "Valid name is required")
            );
        }

        const student = await userModel.findOneAndUpdate(
            { _id: studentId, role: "student" },
            { $set: { name: name.trim() } },
            { new: true, runValidators: true }
        ).select("name email role status createdAt");

        if (!student) {
            return res.status(404).json(
                new ApiResponse(false, null, "Student not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(true, student, "Profile updated successfully")
        );
    } catch (error) {
        next(error);
    }
}
