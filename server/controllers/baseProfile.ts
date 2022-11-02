import { Console } from "console";
import prisma from "../lib/prisma";

export const getBaseProfiles = async (req: any, res: any) => {
  try {
    const baseProfiles = await prisma.baseProfiles.findMany();

    res.status(200).json(baseProfiles);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewBaseProfile = async (req: any, res: any) => {
  try {
    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    const baseProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      BaseProfileCategories: [
        ...categories.map((cat: any) => {
          return {
            id: "",
            categoryId: cat.id,
            categoryName: cat.name,
            isPermissioned: null,
            isActive: true,
          };
        }),
      ],
      BaseProfileStats: [
        ...stats.map((stat: any) => {
          return {
            id: "",
            statId: stat.id,
            statName: stat.name,
            isPermissioned: null,
            isActive: true,
          };
        }),
      ],
    };

    res.status(200).json(baseProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getBaseProfileById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const baseProfile = await prisma.baseProfiles.findUnique({
      where: { id: id },
      include: {
        BaseProfileCategories: {
          include: {
            Category: true,
          },
        },
        BaseProfileStats: {
          include: {
            Stat: true,
          },
        },
      },
    });

    const stats = await (
      await prisma.stats.findMany()
    ).map((x) => {
      return {
        id: "",
        statId: x.id,
        statName: x.name,
        isActive: x.isActive,
        isPermissioned: null,
        isModified: false,
      };
    });
    const categories = await (
      await prisma.categories.findMany()
    ).map((x) => {
      return {
        id: "",
        categoryId: x.id,
        categoryName: x.name,
        isActive: x.isActive,
        isPermissioned: null,
        isModified: false,
      };
    });

    const baseProfileCategoryResult = baseProfile?.BaseProfileCategories.map(
      (x) => {
        return {
          id: x.id,
          categoryId: x.categoryId,
          categoryName: x.Category.name,
          isActive: x.isActive,
          isPermissioned: x.isPermissioned,
          isModified: false,
        };
      }
    );

    const baseProfileStatResult = baseProfile?.BaseProfileStats.map((x) => {
      return {
        id: x.id,
        statId: x.statId,
        statName: x.Stat.name,
        isActive: x.isActive,
        isPermissioned: x.isPermissioned,
        isModified: false,
      };
    });

    let bProfile = { ...baseProfile };
    delete bProfile["BaseProfileCategories"];
    delete bProfile["BaseProfileStats"];

    if (baseProfile?.BaseProfileCategories && baseProfileCategoryResult) {
      bProfile.BaseProfileCategories = [
        ...baseProfileCategoryResult,
        ...categories.filter((f) => {
          return (
            baseProfileCategoryResult.findIndex(
              (cat) => cat.categoryId === f.categoryId
            ) < 0
          );
        }),
      ];
    }

    if (baseProfile?.BaseProfileStats && baseProfileStatResult) {
      bProfile.BaseProfileStats = [
        ...baseProfileStatResult,
        ...stats.filter((f) => {
          return (
            baseProfileStatResult.findIndex(
              (stat) => stat.statId === f.statId
            ) < 0
          );
        }),
      ];
    }

    res.status(200).json(bProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createBaseProfile = async (req: any, res: any) => {
  let post = req.body;
  let baseProfile;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    let { id, name, description, isActive, isPermissioned, CreatedBy } = post;
    const BPData = {
      id,
      name,
      description,
      isActive,
      isPermissioned,
      CreatedBy,
      BaseProfileCategories: {
        create: [
          ...post.BPCategories.map((x: any) => {
            return {
              Category: {
                connect: {
                  id: x.categoryId,
                },
              },
              isActive: x.isActive,
              isPermissioned: x.isPermissioned,
              CreatedBy: { connect: { id: userId } },
            };
          }),
        ],
      },
      BaseProfileStats: {
        create: [
          ...post.BPStats.map((x: any) => {
            return {
              Stat: {
                connect: {
                  id: x.statId,
                },
              },
              isActive: x.isActive,
              isPermissioned: x.isPermissioned,
              CreatedBy: { connect: { id: userId } },
            };
          }),
        ],
      },
    };
    console.log(BPData);

    baseProfile = await prisma.baseProfiles.create({ data: BPData });

    res.status(201).json(baseProfile);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyBaseProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.headers["userId"];
    let post = req.body;

    let { name, description, isActive, isPermissioned, CreatedBy } = post;
    const BPData = {
      name,
      description,
      isActive,

      BaseProfileCategories: {
        upsert: [
          ...post.BPCategories.map((x: any) => {
            return {
              where: {
                id: x.id,
              },

              create: {
                Category: {
                  connect: {
                    id: x.categoryId,
                  },
                },
                isActive: x.isActive,
                isPermissioned: x.isPermissioned,
                CreatedBy: { connect: { id: userId } },
              },
              update: {
                Category: {
                  connect: {
                    id: x.categoryId,
                  },
                },
                isActive: x.isActive,
                isPermissioned: x.isPermissioned,
                CreatedBy: { connect: { id: userId } },
              },
            };
          }),
        ],
      },
      BaseProfileStats: {
        upsert: [
          ...post.BPStats.map((x: any) => {
            return {
              where: {
                id: x.id,
              },

              create: {
                Stat: {
                  connect: {
                    id: x.statId,
                  },
                },
                isActive: x.isActive,
                isPermissioned: x.isPermissioned,
                CreatedBy: { connect: { id: userId } },
              },
              update: {
                Stat: {
                  connect: {
                    id: x.statId,
                  },
                },
                isActive: x.isActive,
                isPermissioned: x.isPermissioned,
                CreatedBy: { connect: { id: userId } },
              },
            };
          }),
        ],
      },
    };

    const baseProfile = await prisma.baseProfiles.update({
      where: {
        id: id,
      },
      data: BPData,
    });
    res.status(200).json(baseProfile);
  } catch (error: any) {
    console.log(error);
    res.json({ mesage: error });
  }
};

export const deleteBaseProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const baseProfile = await prisma.baseProfiles.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(baseProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
