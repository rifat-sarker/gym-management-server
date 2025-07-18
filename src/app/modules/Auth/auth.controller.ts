import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const registerTrainee = catchAsync(async (req, res) => {
  const result = await AuthService.registerTraineeInToDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Trainee register Successfully",
    data: {
      accessToken: result,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);

  res.cookie("refeshToken", result.refeshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});

export const AuthController = {
  registerTrainee,
  loginUser,
};
