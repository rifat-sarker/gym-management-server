import { Role, User } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

const getUsersFromDB = async () => {
  const result = await prisma.user.findMany({});
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
  });
  return result;
};

const updateMyProfileIntoDB = async (
  userId: string,
  payload: Partial<User>
) => {
  const isExist = await prisma.user.findUnique({ where: { id: userId } });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      email: payload.email,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const createTrainerInDB = async (payload: User) => {
  const { email, password, name, role } = payload;

  const isExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with this email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newTrainer = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.TRAINER,
    },
  });

  return newTrainer;
};

export const UserService = {
  getUsersFromDB,
  getUserByIdFromDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
  createTrainerInDB,
};
