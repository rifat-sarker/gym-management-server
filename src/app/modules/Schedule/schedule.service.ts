import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { Role, Schedule } from "@prisma/client";

const createScheduleIntoDB = async (payload: Schedule, createdBy: string) => {
  const { date, startTime, endTime, trainerId } = payload;

  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
  });

  if (!trainer || trainer.role !== Role.TRAINER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid or unauthorized trainer"
    );
  }

  const dateObj = new Date(date);

  // Extract yyyy-mm-dd for consistent date handling without time issues
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const dateOnlyString = `${year}-${month}-${day}`;

  const dateOnly = new Date(`${dateOnlyString}T00:00:00`);

  const startDateTime = new Date(`${dateOnlyString}T${startTime}`);
  const endDateTime = new Date(`${dateOnlyString}T${endTime}`);

  const duration =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  if (duration !== 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Each class must be exactly 2 hours long"
    );
  }

  const existingSchedules = await prisma.schedule.count({
    where: { date: dateOnly },
  });

  if (existingSchedules >= 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot create more than 5 schedules per day"
    );
  }

  const overlappingSchedule = await prisma.schedule.findFirst({
    where: {
      date: dateOnly,
      trainerId,
      AND: [
        { startTime: { lt: endDateTime } },
        { endTime: { gt: startDateTime } },
      ],
    },
  });

  if (overlappingSchedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Trainer already has a schedule during this time slot"
    );
  }

  const newSchedule = await prisma.schedule.create({
    data: {
      date: dateOnly,
      startTime: startDateTime,
      endTime: endDateTime,
      trainerId,
      createdBy,
    },
  });

  return newSchedule;
};

const getAllSchedules = async () => {
  const result = await prisma.schedule.findMany({
    include: {
      trainer: true,
      bookings: true,
    },
  });
  return result;
};

export const ScheduleService = {
  createScheduleIntoDB,
  getAllSchedules,
};
