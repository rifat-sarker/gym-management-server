import prisma from "../../utils/prisma";

const getUsersFromDB = async () => {
  const result = await prisma.user.findMany({});
  return result;
};

export const UserService = { getUsersFromDB };
