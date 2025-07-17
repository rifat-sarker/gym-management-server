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

export const AuthController = {
  registerTrainee,
};
