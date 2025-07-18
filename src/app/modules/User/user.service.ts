import prisma from "../../utils/prisma";

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

export const UserService = {
  getUsersFromDB,
  getUserByIdFromDB,
  getMyProfileFromDB,
};
