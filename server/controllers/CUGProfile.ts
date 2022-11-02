import prisma from "../lib/prisma";

export const getCUGProfiles = async (req: any, res: any) => {
  try {
    const CUGProfiles = await prisma.cUGProfile.findMany();

    res.status(200).json(CUGProfiles);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCUGProfile = async (req: any, res: any) => {
  try {
    // const stats = await prisma.stats.findMany();
    // const categories = await prisma.categories.findMany();

    const CUGProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      CUGProfileId: "",
      CUGProfileCategories: [],
      CUGProfileStats: [],
    };

    res.status(200).json(CUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCUGAndBaseProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

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
    const baseProfileStats = baseProfile?.BaseProfileStats;
    const baseProfileCategories = baseProfile?.BaseProfileCategories;

    const CUGProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      CUGProfileId: "",
      CUGProfileCategories: [
        ...baseProfileCategories?.map((cat: any) => {
          return {
            id: cat.id,
            categoryId: cat.Category.id,
            categoryName: cat.Category.name,
            isPermissioned: cat.isPermissioned,
            isActive: true,
          };
        }),
        ...categories
          .filter((x) => {
            return baseProfileCategories && baseProfileCategories?.length > 0
              ? baseProfileCategories?.findIndex(
                  (bpc) => bpc.categoryId === x.id
                ) < 0
              : false;
          })
          .map((cat: any) => {
            return {
              id: "",
              categoryId: cat.id,
              categoryName: cat.name,
              isPermissioned: null,
              isActive: true,
            };
          }),
      ],
      CUGProfileStats: [
        ...baseProfileStats?.map((stat: any) => {
          return {
            id: stat.id,
            statId: stat.Stat.id,
            statName: stat.Stat.name,
            isPermissioned: stat.isPermissioned,
            isActive: true,
          };
        }),
        ...stats
          .filter((x) => {
            return baseProfileStats && baseProfileStats?.length > 0
              ? baseProfileStats?.findIndex((bps) => bps.statId === x.id) < 0
              : true;
          })
          .map((stat: any) => {
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

    res.status(200).json(CUGProfile);
  } catch (error) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};

export const getCUGProfileById = async (req: any, res: any) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const CUGProfile = await prisma.cUGProfile.findUnique({
      where: { id: id },
      include: {
        CUGProfileCategories: {
          include: {
            Category: true,
          },
        },
        CUGProfileStats: {
          include: {
            Stat: true,
          },
        },
      },
    });

    const baseProfile = await prisma.baseProfiles.findUnique({
      where: { id: CUGProfile?.baseProfileId },
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
    const baseProfileStats = baseProfile?.BaseProfileStats.map((x) => {
      return {
        id: x.id,
        statId: x.Stat.id,
        statName: x.Stat.name,
        isActive: x.isActive,
        isPermissioned: x.isPermissioned,
      };
    });
    const baseProfileCategories = baseProfile?.BaseProfileCategories.map(
      (x) => {
        return {
          id: x.id,
          categoryId: x.Category.id,
          categoryName: x.Category.name,
          isActive: x.isActive,
          isPermissioned: x.isPermissioned,
        };
      }
    );
    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    const CUGProfileCategoryResult = CUGProfile?.CUGProfileCategories.map(
      (x) => {
        return {
          id: x.id,
          categoryId: x.Category.id,
          categoryName: x.Category.name,
          isActive: x.isActive,
          isPermissioned: x.isPermissioned,
        };
      }
    );

    const CUGProfileStatResult = CUGProfile?.CUGProfileStats.map((x) => {
      return {
        id: x.id,
        statId: x.Stat.id,
        statName: x.Stat.name,
        isActive: x.isActive,
        isPermissioned: x.isPermissioned,
      };
    });

    let cUGProfile = { ...CUGProfile };
    delete cUGProfile["CUGProfileCategories"];
    delete cUGProfile["CUGProfileStats"];

    if (CUGProfile?.CUGProfileCategories && CUGProfileCategoryResult) {
      cUGProfile.CUGProfileCategories = [
        ...CUGProfileCategoryResult,
        ...baseProfileCategories,

        ...categories
          .filter((f) => {
            return (
              CUGProfileCategoryResult.findIndex(
                (cat) => cat.categoryId === f.id
              ) < 0 &&
              baseProfileCategories?.findIndex(
                (bcat) => bcat.categoryId === f.id
              ) < 0
            );
          })
          .map((x) => {
            return {
              id: "",
              categoryId: x.id,
              categoryName: x.name,
              isActive: true,
              isPermissioned: null,
            };
          }),
      ];
    }

    if (CUGProfile?.CUGProfileStats && CUGProfileStatResult) {
      cUGProfile.CUGProfileStats = [
        ...CUGProfileStatResult,
        ...baseProfileStats?.filter((f) => {
          return (
            CUGProfileStatResult.findIndex((stat) => stat.statId === f.statId) <
            0
          );
        }),
        ...stats
          .filter((f) => {
            return (
              CUGProfileStatResult.findIndex((stat) => stat.statId === f.id) <
                0 &&
              baseProfileStats.findIndex((stat) => stat.statId === f.id) < 0
            );
          })
          .map((x) => {
            return {
              id: "",
              statId: x.id,
              statName: x.name,
              isActive: true,
              isPermissioned: null,
            };
          }),
      ];
    }
    console.log(baseProfile);
    res.status(200).json(cUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createCUGProfile = async (req: any, res: any) => {
  let post = req.body;
  let CUGProfile;
  const userId = req.headers["userId"];
  console.log(post);

  try {
    post.CreatedBy = { connect: { id: userId } };
    let {
      id,
      name,
      description,
      isActive,
      baseProfileId,
      companyUserGroupId,
      CreatedBy,
    } = post;
    const CUGData = {
      id,
      name,
      description,
      isActive,

      CreatedBy,
      BaseProfile: { connect: { id: baseProfileId } },
      CompanyUserGroup: { connect: { id: companyUserGroupId } },
    };

    if (post.CUGPCategories && post.CUGPCategories.length) {
      CUGData.CUGProfileCategories = {
        create: [
          ...post.CUGPCategories.map((x: any) => {
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
      };
    }
    if (post.CUGPStats && post.CUGPStats.length) {
      CUGData.CUGProfileStats = {
        create: [
          ...post.CUGPStats.map((x: any) => {
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
      };
    }

    console.log(CUGData);
    CUGProfile = await prisma.cUGProfile.create({ data: CUGData });

    res.status(201).json(CUGProfile);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCUGProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.headers["userId"];
    let post = req.body;

    let { name, description, isActive, isPermissioned, CreatedBy } = post;
    const CUGData = {
      name,
      description,
      isActive,

      CUGProfileCategories: {
        upsert: [
          ...post.CUGPCategories.map((x: any) => {
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
                // where: {
                //   categoryId: x.categoryId,
                // },
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
      CUGProfileStats: {
        upsert: [
          ...post.CUGPStats.map((x: any) => {
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
                // where: {
                //   statId: x.statId,
                // },
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

    const CUGProfile = await prisma.cUGProfile.update({
      where: {
        id: id,
      },
      data: CUGData,
    });
    res.status(200).json(CUGProfile);
  } catch (error: any) {
    console.log(error);
    res.json({ mesage: error });
  }
};

export const deleteCUGProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const CUGProfile = await prisma.cUGProfile.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(CUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
