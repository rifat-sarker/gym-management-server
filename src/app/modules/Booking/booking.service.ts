import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

const MAX_TRAINEES_PER_SCHEDULE = 10;

const bookScheduleIntoDB = async (traineeId: string, scheduleId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  const currentBookings = await prisma.booking.count({
    where: { scheduleId },
  });

  if (currentBookings >= MAX_TRAINEES_PER_SCHEDULE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Class schedule is full. Maximum 10 trainees allowed per schedule."
    );
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {
      traineeId_scheduleId: {
        traineeId,
        scheduleId,
      },
    },
  });

  if (existingBooking) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already booked this class"
    );
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      traineeId,
      schedule: {
        startTime: { lt: schedule.endTime },
        endTime: { gt: schedule.startTime },
      },
    },
  });
  if (overlappingBooking) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a booking in this time slot."
    );
  }

  const booking = await prisma.booking.create({
    data: {
      traineeId,
      scheduleId,
    },
  });

  return booking;
};

export const BookingService = {
  bookScheduleIntoDB,
};
