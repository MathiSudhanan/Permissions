import prisma from "../lib/prisma";

export const getAllUserGroups = async (req: any, res: any) => {
  console.log("user group mapping reached");

  try {
    const userGroupMappings = await prisma.userGroupMapping.findMany({
      include: {
        User: true,
        UserGroup: {
          include: {
            UserGroups: {
              include: {
                Company: true,
              },
            },
          },
        },
      },
    });

    const companyUGs = await prisma.companyUserGroup.findMany({
      include: {
        Company: true,
      },
    });

    const UGMappings = userGroupMappings?.map((x: any) => {
      if (x.User && x.UserGroup) {
        return {
          id: x.id,
          userId: x.User.id,
          userName: x.User.firstName + " " + x.User.lastName,
          userGroupName: x.UserGroup.name,
          userGroupId: x.UserGroup.id,
          company: companyUGs.find((c) => c.userGroupId === x.UserGroup.id)
            ?.Company?.name,
          companyId: companyUGs.find((c) => c.userGroupId === x.UserGroup.id)
            ?.Company?.id,
          isActive: x.isActive,
        };
      }
    });
    console.log("user group mapping", UGMappings);

    res.status(200).json(UGMappings);
  } catch (error) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};

export const getUserGroupById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userGroupMappings = await prisma.userGroupMapping.findUnique({
      where: {
        id: id,
      },
      include: {
        User: true,
        UserGroup: true,
      },
    });
    console.log("user group mapping", userGroupMappings);

    res.status(200).json(userGroupMappings);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getUsersByUserGroupId = async (req: any, res: any) => {
  try {
    const { userGroupId } = req.params;
    console.log("user group Id", userGroupId);
    const compUserGroup = await prisma.companyUserGroup.findUnique({
      where: {
        id: userGroupId,
      },
    });

    if (!compUserGroup || !compUserGroup.userGroupId) {
      res.status(200).json([]);
    } else {
      const userGroupMappings = await prisma.userGroupMapping.findMany({
        where: {
          userGroupId: compUserGroup.userGroupId,
        },
        include: {
          User: true,
        },
      });
      console.log("user group mapping", userGroupMappings);

      res.status(200).json(
        userGroupMappings.map((x) => {
          return {
            id: x.User?.id,
            name: x.User?.firstName + " " + x.User?.lastName,
          };
        })
      );
    }
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const mapUserGroupToUser = async (req: any, res: any) => {
  let post = req.body;
  let userGroupMapping;
  const loggedInUserId = req.headers["userId"];

  let umData: any = {
    CreatedBy: {
      connect: { id: loggedInUserId },
    },
    User: {
      connect: {
        id: post.userId,
      },
    },
    UserGroup: {
      connect: {
        id: post.userGroupId,
      },
    },
    isActive: post.isActive,
  };
  try {
    // post.createdBy = { connect: { id: loggedInUserId } };
    const userGroupMapping = await prisma.userGroupMapping.create({
      data: umData,
    });
    res.status(201).json(userGroupMapping);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyUserGroupMapping = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.get("userId");
    let post = req.body;

    const userGroupMapping = await prisma.userGroupMapping.update({
      where: {
        id: id,
      },
      data: {
        userGroupId: post.userGroupId,
        userId: post.userId,
        isActive: post.isActive,
      },
    });
    res.status(200).json(userGroupMapping);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
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
