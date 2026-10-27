import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js";
import {generatHash,verifyHash} from "../Config/bcrypt.js";


// export async function registerUser(req,res,next) {
//     try{
//         const {name,email,password}=req.body;

//     let hash = await generatHash(password);

//    let user = await userModel.create({ email, name, password :hash});
//    return res.status(201).json(new ApiResponse(true,user,"success"));     
//   }
//     catch (error) {
//     res.status(500).json(new ApiResponse(false, null, error.message || "inertanl server error"));
//     }
// }

//updated 
export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json(
        new ApiResponse(
          false,
          null,
          "Valid name, email and password (minimum 6 characters) are required"
        )
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const hash = await generatHash(password);

    const user = await userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash
    });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return res.status(201).json(
      new ApiResponse(true, safeUser, "Registration successful")
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(
        new ApiResponse(false, null, "Email already registered")
      );
    }

    if (error.name === "ValidationError") {
      return res.status(400).json(
        new ApiResponse(false, null, error.message)
      );
    }

    return res.status(500).json(
      new ApiResponse(false, null, "Internal server error")
    );
  }
}

export async function getAllUsers(req,res,next){
    try{
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            userModel.find({ role: "student" })
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            userModel.countDocuments({ role: "student" })
        ]);

        res.status(200).json(new ApiResponse(true, {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, "Students fetched successfully"))
    }

    catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}
export async function getUserById(req,res,next){
    try{
        let user=await userModel.findById(req.params.id).select("-password");
         if(!user)
         {
            return res.status(404).json(new ApiResponse(false,null,"user not found"))
         }
         return res.status(200).json(new ApiResponse(true,user,"user found"));

       
    }catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"))
    }
}


export async function updateUser(req, res, next) {
  try {
    const { name, email } = req.body;

    // Only allow name and email updates
    if (name === undefined && email === undefined) {
      return res.status(400).json(
        new ApiResponse(false, null, "Name or email is required")
      );
    }

    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json(
          new ApiResponse(false, null, "Valid name is required")
        );
      }

      updateData.name = name.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json(
          new ApiResponse(false, null, "Valid email is required")
        );
      }

      updateData.email = email.trim().toLowerCase();
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-password"
      }
    );

    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, null, "User not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(true, user, "User updated successfully")
    );

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(
        new ApiResponse(false, null, "Email already registered")
      );
    }

    if (error.name === "ValidationError") {
      return res.status(400).json(
        new ApiResponse(false, null, error.message)
      );
    }

    return res.status(500).json(
      new ApiResponse(false, null, "Internal server error")
    );
  }
}


export async function deleteUser(req, res, next) {
    try {
        if (req.params.id === String(req.user?._id)) {
            return res.status(400).json(new ApiResponse(false, null, "You cannot delete your own account"));
        }
        let user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json(new ApiResponse(false, null, "user not found"));

        res.status(200).json(new ApiResponse(true, { id: user._id }, "user deleted successfully!"));

    } catch (error) {
        res.status(500).json(new ApiResponse(false, error.message || "internal server error"));

    }
}
