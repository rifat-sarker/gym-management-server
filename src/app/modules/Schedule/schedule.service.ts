import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { Role, Schedule } from "@prisma/client";



const createScheduleIntoDB = async (payload: Schedule, createdBy: string) => {
  const { date, startTime, endTime, trainerId } = payload;

  const trainer = await prisma.user.findUnique({ where: { id: trainerId } });
  if (!trainer || trainer.role !== Role.TRAINER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid or unauthorized trainer"
    );
  }

  const dateOnlyString = new Date(date).toISOString().split("T")[0]; 

  const startDateTime = new Date(`${dateOnlyString}T${startTime}Z`);
  const endDateTime = new Date(`${dateOnlyString}T${endTime}Z`);
  const dateOnlyUTC = new Date(`${dateOnlyString}T00:00:00Z`);

  const duration =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  if (duration !== 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Each class must be exactly 2 hours long"
    );
  }

  const existingSchedules = await prisma.schedule.count({
    where: { date: dateOnlyUTC },
  });

  if (existingSchedules >= 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot create more than 5 schedules per day"
    );
  }

  const overlappingSchedule = await prisma.schedule.findFirst({
    where: {
      date: dateOnlyUTC,
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
      date: dateOnlyUTC,
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

const getScheduleById = async (id: string) => {
  const result = await prisma.schedule.findUnique({ where: { id } });
  return result;
};


const updateSchedule = async (id: string, payload: Schedule) => {
  const { date, startTime, endTime, trainerId } = payload;

  const existingSchedule = await prisma.schedule.findUnique({ where: { id } });
  if (!existingSchedule) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  const trainer = await prisma.user.findUnique({ where: { id: trainerId } });
  if (!trainer || trainer.role !== Role.TRAINER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid or unauthorized trainer"
    );
  }

  const dateOnlyString = new Date(date).toISOString().split("T")[0]; 

  const startDateTime = new Date(`${dateOnlyString}T${startTime}Z`);
  const endDateTime = new Date(`${dateOnlyString}T${endTime}Z`);
  const dateOnlyUTC = new Date(`${dateOnlyString}T00:00:00Z`);

  const duration =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  if (duration !== 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Each class must be exactly 2 hours long"
    );
  }

  const overlappingSchedule = await prisma.schedule.findFirst({
    where: {
      id: { not: id },
      date: dateOnlyUTC,
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

  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      date: dateOnlyUTC,
      startTime: startDateTime,
      endTime: endDateTime,
      trainerId,
    },
  });

  return updatedSchedule;
};



const deleteSchedule = async (id: string) => {
  const result = await prisma.schedule.delete({ where: { id } });
  return result;
};

export const ScheduleService = {
  createScheduleIntoDB,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
