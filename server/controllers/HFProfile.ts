import { Console } from "console";
import prisma from "../lib/prisma";

export const getHFProfiles = async (req: any, res: any) => {
  try {
    const HFProfiles = await prisma.hedgeFundProfile.findMany();

    res.status(200).json(HFProfiles);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewHFProfile = async (req: any, res: any) => {
  try {
    const stats = await prisma.stats.findMany();
    const categories = await prisma.hedgeFundProfile.findMany();

    const HFProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      CUGProfileId: "",
      HedgeFundProfileCategories: [
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
      HedgeFundProfileStats: [
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

    res.status(200).json(HFProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getHFProfileById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const HFProfile = await prisma.hedgeFundProfile.findUnique({
      where: { id: id },
      include: {
        HedgeFundProfileCategories: {
          include: {
            Category: true,
          },
        },
        HedgeFundProfileStats: {
          include: {
            Stat: true,
          },
        },
      },
    });

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    const HFProfileCategoryResult = HFProfile?.HedgeFundProfileCategories.map(
      (x) => {
        return {
          id: x.id,
          categoryId: x.categoryId,
          categoryName: x.Category.name,
          isActive: x.isActive,
          isPermissioned: x.isPermissioned,
        };
      }
    );

    const HFProfileStatResult = HFProfile?.HedgeFundProfileStats.map((x) => {
      return {
        id: x.id,
        statId: x.statId,
        statName: x.Stat.name,
        isActive: x.isActive,
        isPermissioned: x.isPermissioned,
      };
    });

    let hfProfile = { ...HFProfile };
    delete hfProfile["HFProfileCategories"];
    delete hfProfile["HFProfileStats"];

    if (HFProfile?.HedgeFundProfileCategories && HFProfileCategoryResult) {
      hfProfile.HedgeFundProfileCategories = [
        ...HFProfileCategoryResult,
        ...categories
          .filter((f) => {
            return (
              HFProfileCategoryResult.findIndex(
                (cat) => cat.categoryId === f.id
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

    if (HFProfile?.HedgeFundProfileStats && HFProfileStatResult) {
      hfProfile.HedgeFundProfileStats = [
        ...HFProfileStatResult,
        ...stats
          .filter((f) => {
            return (
              HFProfileStatResult.findIndex((stat) => stat.statId === f.id) < 0
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

    res.status(200).json(HFProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createHFProfile = async (req: any, res: any) => {
  let post = req.body;
  let HFProfile;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    let {
      id,
      name,
      description,
      isActive,
      baseProfileId,
      isPermissioned,
      CreatedBy,
    } = post;
    const HFData = {
      id,
      name,
      description,
      isActive,
      isPermissioned,
      CreatedBy,
      baseProfileId,
      HedgeFundProfileCategories: {
        create: [
          ...post.HFCategories.map((x: any) => {
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
      HedgeFundProfileStats: {
        create: [
          ...post.HFStats.map((x: any) => {
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

    HFProfile = await prisma.hedgeFundProfile.create({ data: HFData });

    res.status(201).json(HFProfile);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyHFProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.headers["userId"];
    let post = req.body;

    let { name, description, isActive, isPermissioned, CreatedBy } = post;
    const HFData = {
      name,
      description,
      isActive,

      HedgeFundProfileCategories: {
        upsert: [
          ...post.HFCategories.map((x: any) => {
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
      HedgeFundProfileStats: {
        upsert: [
          ...post.HFStats.map((x: any) => {
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

    const HFProfile = await prisma.hedgeFundProfile.update({
      where: {
        id: id,
      },
      data: HFData,
    });
    res.status(200).json(HFProfile);
  } catch (error: any) {
    console.log(error);
    res.json({ mesage: error });
  }
};

export const deleteHFProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const HFProfile = await prisma.hedgeFundProfile.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(HFProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
