import prisma from "../lib/prisma";

export const mapUserGroupToUser = async (req: any, res: any) => {
  let post = req.body;
  let userGroupMpping;
  const userId = req.headers["userId"];

  try {
    post.createdBy = { connect: { id: userId } };
    userGroupMpping = await prisma.userGroupMapping.create({ data: post });
    res.status(201).json(userGroupMpping);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const removeUserGroupFromUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userGroupMpping = await prisma.userGroupMapping.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(userGroupMpping);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
