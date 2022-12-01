import prisma from "../lib/prisma";

export const getCompanyUserGroups = async (req: any, res: any) => {
  try {
    const companyUserGroups = await prisma.companyUserGroup.findMany({
      include: {
        Company: true,
        UserGroup: true,
      },
    });

    res.status(200).json(
      companyUserGroups.map((x) => {
        return {
          id: x.id,
          name: x.name,
          description: x.description,
          company: x.Company.name,
          userGroup: x.UserGroup.name,
          isActive: x.isActive,
        };
      })
    );
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getCompanyUserGroupById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const companyUserGroup = await prisma.companyUserGroup.findUnique({
      where: { id: id },
    });

    res.status(200).json(companyUserGroup);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getUserGroupsByCompanyId = async (req: any, res: any) => {
  try {
    const { companyId } = req.params;
    const companyUserGroups = await prisma.companyUserGroup.findMany({
      where: { companyId: companyId },
      include: {
        UserGroup: true,
      },
    });
    const userGroups = companyUserGroups.map((x) => {
      return {
        id: x.id,
        name: x.name,
      };
    });
    res.status(200).json(userGroups);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const mapCompanyToUserGroup = async (req: any, res: any) => {
  let post = req.body;
  let companyUserGroup;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    post.Company = { connect: { id: post.companyId } };
    post.UserGroup = { connect: { id: post.userGroupId } };

    const cUGAlreadyExists = await prisma.companyUserGroup.findUnique({
      where: {
        companyUserGroupId: {
          companyId: post.companyId,
          userGroupId: post.userGroupId,
        },
      },
    });
    delete post["companyId"];
    delete post["userGroupId"];

    if (cUGAlreadyExists?.id) {
      let error = { message: " " };
      throw error;
    } else {
      const companyUserGroup = await prisma.companyUserGroup.create({
        data: post,
      });
    }
    res.status(201).json(companyUserGroup);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCompanyUserGroup = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;
    post.Company = { connect: { id: post.companyId } };
    post.UserGroup = { connect: { id: post.userGroupId } };

    delete post["companyId"];
    delete post["userGroupId"];

    const cug = await prisma.companyUserGroup.update({
      where: {
        id: id,
      },
      data: post,
    });
    res.status(200).json(cug);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};

export const removeCompanyUserGroup = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const companyUserGroup = await prisma.companyUserGroup.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(companyUserGroup);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
