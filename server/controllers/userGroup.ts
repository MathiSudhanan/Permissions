import prisma from "../lib/prisma";

export const getUserGroups = async (req: any, res: any) => {
  try {
    const userGroups = await prisma.userGroups.findMany();

    res.status(200).json(userGroups);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getUserGroupId = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userGroup = await prisma.userGroups.findUnique({ where: { id: id } });

    res.status(200).json(userGroup);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createUserGroup = async (req: any, res: any) => {
  let post = req.body;
  let userGroup;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };

    userGroup = await prisma.userGroups.create({ data: post });
    res.status(201).json(userGroup);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyUserGroup = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const userGroup = await prisma.userGroups.update({
      where: {
        id: id,
      },
      data: {
        name: post.name,
        description: post.description,
        isActive: post.isActive,
      },
    });
    res.status(200).json(userGroup);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const deleteUserGroup = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userGroup = await prisma.userGroups.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(userGroup);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
