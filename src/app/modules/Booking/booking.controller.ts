import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const bookSchedule = catchAsync(async (req, res) => {
  const traineeId = req.user.id;
  const { scheduleId } = req.params;

  const result = await BookingService.bookScheduleIntoDB(traineeId, scheduleId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Class booked successfully",
    data: result,
  });
});

export const BookingController = {
  bookSchedule,
};
