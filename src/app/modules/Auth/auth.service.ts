import { Role, User } from "@prisma/client";
import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken } from "../../utils/createToken";
import config from "../../config";

const registerTraineeInToDB = async (payload: User) => {
  const { name, email, password } = payload;
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  const isExistUser = await prisma.user.findFirst({
    where: { email: email },
  });

  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to hash password. Please try again."
    );
  }

  const registerUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: Role.TRAINEE,
    },
  });

  const jwtPayload = {
    id: registerUser.id,
    email: registerUser.email,
    role: registerUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_scret as string,
    config.jwt.expires_in as string
  );
  return accessToken;
};

const loginUserIntoDB = async (payload: User) => {
  if (!payload.email || !payload.password) {
    throw new AppError(
      httpStatus.NON_AUTHORITATIVE_INFORMATION,
      "Missing required fields"
    );
  }

  const isExistUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (!isExistUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid email or password please try again"
    );
  }

  const checkPassword = await bcrypt.compare(
    payload.password,
    isExistUser?.password
  );
  if (!checkPassword) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password please try again"
    );
  }

  const jwtPayload = {
    id: isExistUser.id,
    email: isExistUser.email,
    role: isExistUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_scret as string,
    config.jwt.expires_in as string
  );
  const refeshToken = createToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  const result = {
    accessToken,
    refeshToken,
  };
  return result;
};

export const AuthService = {
  registerTraineeInToDB,
  loginUserIntoDB,
};
