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

const cancelBooking = catchAsync(async (req, res) => {
  const traineeId = req.user.id;
  const { bookingId } = req.params;

  await BookingService.cancelBookingIntoDB(traineeId, bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: null,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingService.getAllBookings();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
});


const myBookings = catchAsync(async (req, res) => {
  const traineeId = req.user.id;
  const result = await BookingService.myBookingsIntoDB(traineeId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My bookings retrieved successfully",
    data: result,
  });
});

export const BookingController = {
  bookSchedule,
  cancelBooking,
  getAllBookings,
  myBookings,
};
