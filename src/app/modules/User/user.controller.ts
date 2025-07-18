import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const getUser = catchAsync(async (req, res) => {
  const result = await UserService.getUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserByIdFromDB(id);

  if (!result) {
    throw new Error("User not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await UserService.getMyProfileFromDB(userId);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const updateData = req.body;

  const result = await UserService.updateMyProfileIntoDB(userId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const createTrainer = catchAsync(async (req, res) => {
  const result = await UserService.createTrainerInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Trainer created successfully",
    data: result,
  });
});

export const UserController = {
  getUser,
  getUserById,
  getMyProfile,
  updateMyProfile,
  createTrainer,
};
