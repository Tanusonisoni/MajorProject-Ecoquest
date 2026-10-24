import notificationModel from "../models/notificationModel.js";
import { ApiResponse } from "../utils/resPattern.js";

// Get logged-in student's notifications
export async function getMyNotifications(req, res) {
  try {
    const userId = req.user._id;

    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(true, notifications, "Notifications fetched successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, null, "Internal server error")
    );
  }
}

// Mark one notification as read
export async function markNotificationRead(req, res) {
  try {
    const notification = await notificationModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { $set: { isRead: true } },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json(
        new ApiResponse(false, null, "Notification not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(true, notification, "Notification marked as read")
    );
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json(
        new ApiResponse(false, null, "Invalid notification ID")
      );
    }

    return res.status(500).json(
      new ApiResponse(false, null, "Internal server error")
    );
  }
}