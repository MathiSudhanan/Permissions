import prisma from "../lib/prisma";
import {
  getCompleteCatgoryDetails,
  getMissedOutCategories,
  getMostRestrictiveCategories,
  getOverridenCategories,
} from "../Utils/CategoryUtils";
import {
  getCompleteStatDetails,
  getMissedOutStats,
  getMostRestrictiveStats,
  getOverridenStats,
} from "../Utils/StatUtils";

export const getCFUGProfiles = async (req: any, res: any) => {
  try {
    const CFUGProfiles = await prisma.clientFundUserGroupProfile.findMany();

    res.status(200).json(CFUGProfiles);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCFUGProfile = async (req: any, res: any) => {
  try {
    const CFUGProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      userGroupId: "",
      clientFundId: "",
      CFUGProfileCategories: [],
      CFUGProfileStats: [],
    };

    res.status(200).json(CFUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCFUGAndOtherProfiles = async (req: any, res: any) => {
  try {
    const { clientFundId, userGroupId } = req.params;

    const clientFund = await prisma.clientFunds.findUnique({
      where: {
        id: clientFundId,
      },
    });

    const hfProfile = await prisma.hedgeFundProfile.findFirst({
      where: { fundId: clientFund?.fundId },
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

    const companyUserGroup = await prisma.companyUserGroup.findFirst({
      where: { userGroupId: userGroupId },
    });

    const cugProfile = await prisma.cUGProfile.findFirst({
      where: { companyUserGroupId: companyUserGroup?.id },
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

    let cugProfileStats = getCompleteStatDetails(cugProfile?.CUGProfileStats);
    let cugProfileCategories = getCompleteCatgoryDetails(
      cugProfile?.CUGProfileCategories
    );

    const baseProfile = await prisma.baseProfiles.findUnique({
      where: { id: cugProfile?.baseProfileId },
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
    let baseProfileStats = getCompleteStatDetails(
      baseProfile?.BaseProfileStats
    );
    let baseProfileCategories = getCompleteCatgoryDetails(
      baseProfile?.BaseProfileCategories
    );

    if (cugProfile) {
      if (cugProfile.CUGProfileStats) {
        cugProfileStats = getOverridenStats(cugProfileStats, baseProfileStats);
      } else {
        cugProfileStats = baseProfileStats;
      }

      if (cugProfile.CUGProfileCategories) {
        cugProfileCategories = getOverridenCategories(
          cugProfileCategories,
          baseProfileCategories
        );
      } else {
        cugProfileCategories = baseProfileCategories;
      }
    }

    let hfProfileStats = [];
    let hfProfileCategories = [];
    if (hfProfile) {
      hfProfileStats = getCompleteStatDetails(hfProfile?.HedgeFundProfileStats);
      hfProfileCategories = getCompleteCatgoryDetails(
        hfProfile?.HedgeFundProfileCategories
      );

      if (hfProfile.HedgeFundProfileStats) {
        hfProfileStats = getMostRestrictiveStats(
          hfProfileStats,
          cugProfileStats
        );
      } else {
        hfProfileStats = cugProfileStats;
      }

      if (hfProfile.HedgeFundProfileCategories) {
        hfProfileCategories = getMostRestrictiveCategories(
          hfProfileCategories,
          cugProfileCategories
        );
      } else {
        hfProfileCategories = cugProfileCategories;
      }
    } else {
      hfProfileCategories = cugProfileCategories;
      hfProfileStats = cugProfileStats;
    }

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    const cfugProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      companyId: "",
      userGroupId: "",
      clientFundId: "",
      CFUGProfileCategories: getMissedOutCategories(
        hfProfileCategories,
        categories
      ),
      CFUGProfileStats: getMissedOutStats(hfProfileStats, stats),
    };

    res.status(200).json(cfugProfile);
  } catch (error) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};

export const getCFUGProfileById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const cfugProfile = await prisma.clientFundUserGroupProfile.findUnique({
      where: { id: id },
      include: {
        ClientFund: {
          include: {
            Fund: true,
          },
        },
        UserGroup: true,
        ClientFundUserGroupProfileCategories: {
          include: {
            Category: true,
          },
        },
        ClientFundUserGroupProfileStats: {
          include: {
            Stat: true,
          },
        },
      },
    });

    const hfProfile = await prisma.hedgeFundProfile.findFirst({
      where: { fundId: cfugProfile?.ClientFund.fundId },
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

    const cugProfile = await prisma.cUGProfile.findFirst({
      where: { companyUserGroupId: cfugProfile?.UserGroup?.id },
      include: {
        BaseProfile: true,
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

    const baseProfile = await prisma.baseProfiles.findFirst({
      where: { id: cugProfile?.baseProfileId },
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

    let cfugProfileStats = getCompleteStatDetails(
      cfugProfile?.ClientFundUserGroupProfileStats
    );
    let cfugProfileCategories = getCompleteCatgoryDetails(
      cfugProfile?.ClientFundUserGroupProfileCategories
    );
    let hfProfileStats = getCompleteStatDetails(
      hfProfile?.HedgeFundProfileStats
    );
    let hfProfileCategories = getCompleteCatgoryDetails(
      hfProfile?.HedgeFundProfileCategories
    );
    let cugProfileStats = getCompleteStatDetails(cugProfile?.CUGProfileStats);
    let cugProfileCategories = getCompleteCatgoryDetails(
      cugProfile?.CUGProfileCategories
    );
    let baseProfileStats = getCompleteStatDetails(
      baseProfile?.BaseProfileStats
    );
    let baseProfileCategories = getCompleteCatgoryDetails(
      baseProfile?.BaseProfileCategories
    );

    if (cugProfile) {
      if (cugProfile.CUGProfileStats) {
        cugProfileStats = getOverridenStats(cugProfileStats, baseProfileStats);
      }

      if (cugProfile.CUGProfileCategories) {
        cugProfileCategories = getOverridenCategories(
          cugProfileCategories,
          baseProfileCategories
        );
      }
    }

    if (hfProfile) {
      if (hfProfile.HedgeFundProfileStats) {
        hfProfileStats = getMostRestrictiveStats(
          hfProfileStats,
          cugProfileStats
        );
      }

      if (hfProfile.HedgeFundProfileCategories) {
        hfProfileCategories = getMostRestrictiveCategories(
          hfProfileCategories,
          cugProfileCategories
        );
      }
    }

    if (cfugProfile?.ClientFundUserGroupProfileCategories) {
      cfugProfileCategories = getOverridenCategories(
        cfugProfileCategories,
        hfProfileCategories
      );
    }

    if (cfugProfile?.ClientFundUserGroupProfileStats) {
      cfugProfileStats = getOverridenStats(cfugProfileStats, hfProfileStats);
    }

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    let cfugPro = { ...cfugProfile };
    delete cfugPro["ClientFundUserGroupProfileCategories"];
    delete cfugPro["ClientFundUserGroupProfileStats"];

    if (cfugProfileCategories) {
      cfugPro["CFUGProfileCategories"] = getMissedOutCategories(
        cfugProfileCategories,
        categories
      );
    }

    if (cfugProfileStats) {
      cfugPro["CFUGProfileStats"] = getMissedOutStats(cfugProfileStats, stats);
    }

    res.status(200).json(cfugPro);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createCFUGProfile = async (req: any, res: any) => {
  let post = req.body;
  let CFUGProfile;
  const userId = req.headers["userId"];

  try {
    post.CreatedBy = { connect: { id: userId } };
    let {
      id,
      name,
      description,
      isActive,
      companyId,
      userGroupId,
      clientFundId,
      CreatedBy,
    } = post;

    // const companyUserGroup = await prisma.companyUserGroup.findFirst({
    //   where: {
    //     userGroupId: userGroupId,
    //   },
    // });

    const CFUGData = {
      id,
      name,
      description,
      isActive,
      CreatedBy,
      ClientFund: { connect: { id: clientFundId } },
      UserGroup: { connect: { id: userGroupId } },
      Company: { connect: { id: companyId } },
    };

    if (post.CFUGPCategories && post.CFUGPCategories.length) {
      CFUGData.ClientFundUserGroupProfileCategories = {
        create: [
          ...post.CFUGPCategories.map((x: any) => {
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
    if (post.CFUGPStats && post.CFUGPStats.length) {
      CFUGData.ClientFundUserGroupProfileStats = {
        create: [
          ...post.CFUGPStats.map((x: any) => {
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

    CFUGProfile = await prisma.clientFundUserGroupProfile.create({
      data: CFUGData,
    });

    res.status(201).json(CFUGProfile);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCFUGProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.headers["userId"];
    let post = req.body;

    let {
      name,
      description,
      isActive,
      userGroupId,
      clientFundId,
      CreatedBy,
      companyId,
    } = post;

    const companyUserGroup = await prisma.companyUserGroup.findFirst({
      where: {
        userGroupId: userGroupId,
      },
    });

    const CFUGData = {
      name,
      description,
      isActive,

      CreatedBy,
      clientFundId,
      userGroupId,
      companyId,
      ClientFundUserGroupProfileCategories: {
        upsert: [
          ...post.CFUGPCategories.map((x: any) => {
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
      ClientFundUserGroupProfileStats: {
        upsert: [
          ...post.CFUGPStats.map((x: any) => {
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

    const CFUGProfile = await prisma.clientFundUserGroupProfile.update({
      where: {
        id: id,
      },
      data: CFUGData,
    });
    res.status(200).json(CFUGProfile);
  } catch (error: any) {
    console.log(error);
    res.json({ mesage: error });
  }
};

export const deleteCFUGProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const CUGProfile = await prisma.clientFundUserGroupProfile.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(CUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
