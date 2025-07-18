import prisma from "../../utils/prisma";

const getUsersFromDB = async () => {
  const result = await prisma.user.findMany({});
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  return result;
};

export const UserService = { getUsersFromDB, getUserByIdFromDB };
