import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";

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

export const UserController = {
  getUser,
  getUserById,
};
