import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";
import AppError from "../../errors/AppError";

const createSchedule = catchAsync(async (req, res) => {
  const scheduleData = req.body;
  const createdByUserId = req.user.id;

  const result = await ScheduleService.createScheduleIntoDB(
    scheduleData,
    createdByUserId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const result = await ScheduleService.getAllSchedules();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedules retrieved successfully",
    data: result,
  });
});

const getScheduleById = catchAsync(async (req, res) => {
  const scheduleId = req.params.id;
  const result = await ScheduleService.getScheduleById(scheduleId);

  if (!result) {
    throw new Error("Schedule not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

const updateSchedule = catchAsync(async (req, res) => {
  const scheduleId = req.params.id;
  const updateData = req.body;
  const result = await ScheduleService.updateSchedule(scheduleId, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedule updated successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const scheduleId = req.params.id;
  const result = await ScheduleService.deleteSchedule(scheduleId);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK, 
    message: "Schedule deleted successfully",
    data: null,
  });
});


export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
