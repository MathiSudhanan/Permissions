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

export const getCFUProfiles = async (req: any, res: any) => {
  try {
    const cfuProfiles = await prisma.clientFundUserProfile.findMany();

    res.status(200).json(cfuProfiles);
  } catch (error: any) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCFUProfile = async (req: any, res: any) => {
  try {
    const cfuProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      userGroupId: "",
      userId: "",

      clientFundId: "",
      CFUProfileCategories: [],
      CFUProfileStats: [],
    };

    res.status(200).json(cfuProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const getNewCFUAndOtherProfiles = async (req: any, res: any) => {
  try {
    const { clientFundId, selectedUserId } = req.params;

    const cfugProfile = await prisma.clientFundUserGroupProfile.findFirst({
      where: { clientFundId: clientFundId },
      include: {
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
    let cfugProfileStats = getCompleteStatDetails(
      cfugProfile?.ClientFundUserGroupProfileStats
    );
    let cfugProfileCategories = getCompleteCatgoryDetails(
      cfugProfile?.ClientFundUserGroupProfileCategories
    );

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
    let hfProfileStats = getCompleteStatDetails(
      hfProfile?.HedgeFundProfileStats
    );
    let hfProfileCategories = getCompleteCatgoryDetails(
      hfProfile?.HedgeFundProfileCategories
    );

    const userGroup = await prisma.userGroupMapping.findFirst({
      where: { userId: selectedUserId },
    });

    const companyUserGroup = await prisma.companyUserGroup.findFirst({
      where: { userGroupId: userGroup?.id },
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

    if (cfugProfile) {
      if (cfugProfile.ClientFundUserGroupProfileStats) {
        cfugProfileStats = getOverridenStats(cfugProfileStats, hfProfileStats);
      }

      if (cfugProfile.ClientFundUserGroupProfileCategories) {
        cfugProfileCategories = getOverridenCategories(
          cfugProfileCategories,
          hfProfileCategories
        );
      }
    }

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    const cfuProfile = {
      id: "",
      name: "",
      description: "",
      isActive: true,
      companyId: "",
      userGroupId: "",
      userId: "",
      clientFundId: "",
      CFUProfileCategories: getMissedOutCategories(
        cfugProfileCategories,
        categories
      ),
      CFUProfileStats: getMissedOutStats(cfugProfileStats, stats),
    };

    res.status(200).json(cfuProfile);
  } catch (error) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};

export const getCFUProfileById = async (req: any, res: any) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const cfuProfile = await prisma.clientFundUserProfile.findUnique({
      where: { id: id },
      include: {
        ClientFund: {
          include: {
            Fund: true,
          },
        },
        UserGroup: true,
        User: true,
        ClientFundUserProfileCategories: {
          include: {
            Category: true,
          },
        },
        ClientFundUserProfileStats: {
          include: {
            Stat: true,
          },
        },
      },
    });

    const cfugProfile = await prisma.clientFundUserGroupProfile.findFirst({
      where: { clientFundId: cfuProfile?.clientFundId },
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
      where: { fundId: cfuProfile?.ClientFund.fundId },
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

    let cfuProfileStats = getCompleteStatDetails(
      cfuProfile?.ClientFundUserProfileStats
    );
    let cfuProfileCategories = getCompleteCatgoryDetails(
      cfuProfile?.ClientFundUserProfileCategories
    );

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
      cfuProfileStats = getOverridenStats(cfuProfileStats, hfProfileStats);
    }

    if (cfuProfile?.ClientFundUserProfileCategories) {
      cfuProfileCategories = getOverridenCategories(
        cfuProfileCategories,
        cfugProfileCategories
      );
    }

    if (cfuProfile?.ClientFundUserProfileStats) {
      cfuProfileStats = getOverridenStats(cfuProfileStats, cfugProfileStats);
    }

    const stats = await prisma.stats.findMany();
    const categories = await prisma.categories.findMany();

    let cfuPro = { ...cfuProfile };

    const userGroupMapping = await prisma.userGroupMapping.findFirst({
      where: {
        userId: cfuPro.userId,
      },
    });

    if (cfuPro.companyId && userGroupMapping && userGroupMapping.userGroupId) {
      const compUserGroup = await prisma.companyUserGroup.findFirst({
        where: {
          companyId: cfuPro?.companyId,
          userGroupId: userGroupMapping?.userGroupId,
        },
      });
      cfuPro.userGroupId = compUserGroup?.id;
    }

    delete cfuPro["ClientFundUserProfileCategories"];
    delete cfuPro["ClientFundUserProfileStats"];

    console.log(cfuPro.ClientFundUserProfileStats);

    if (cfuProfileCategories) {
      cfuPro["CFUProfileCategories"] = getMissedOutCategories(
        cfuProfileCategories,
        categories
      );
    }

    if (cfuProfileStats) {
      cfuPro["CFUProfileStats"] = getMissedOutStats(cfuProfileStats, stats);
    }

    console.log("final", cfuPro.CFUProfileStats);
    res.status(200).json(cfuPro);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const createCFUProfile = async (req: any, res: any) => {
  let post = req.body;
  let CFUProfile;
  const loggedInUserId = req.headers["userId"];
  console.log(post);

  try {
    post.CreatedBy = { connect: { id: loggedInUserId } };
    let {
      id,
      name,
      description,
      isActive,
      companyId,
      userId,
      clientFundId,
      CreatedBy,
    } = post;

    // const user = await prisma.users.findFirst({
    //   where: {
    //     id: userId,
    //   },
    // });

    const CFUData = {
      id,
      name,
      description,
      isActive,
      CreatedBy,
      ClientFund: { connect: { id: clientFundId } },
      User: { connect: { id: userId } },
      Company: { connect: { id: companyId } },
    };

    if (post.CFUPCategories && post.CFUPCategories.length) {
      CFUData.ClientFundUserProfileCategories = {
        create: [
          ...post.CFUPCategories.map((x: any) => {
            return {
              Category: {
                connect: {
                  id: x.categoryId,
                },
              },
              isActive: x.isActive,
              isPermissioned: x.isPermissioned,
              CreatedBy: { connect: { id: loggedInUserId } },
            };
          }),
        ],
      };
    }
    if (post.CFUPStats && post.CFUPStats.length) {
      CFUData.ClientFundUserProfileStats = {
        create: [
          ...post.CFUPStats.map((x: any) => {
            return {
              Stat: {
                connect: {
                  id: x.statId,
                },
              },
              isActive: x.isActive,
              isPermissioned: x.isPermissioned,
              CreatedBy: { connect: { id: loggedInUserId } },
            };
          }),
        ],
      };
    }

    console.log(CFUData);
    CFUProfile = await prisma.clientFundUserProfile.create({
      data: CFUData,
    });

    res.status(201).json(CFUProfile);
  } catch (error) {
    console.log(error);

    res.status(409).json({ mesage: error });
  }
};

export const modifyCFUProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.headers["userId"];
    let post = req.body;

    let {
      name,
      description,
      isActive,
      userId,
      clientFundId,
      CreatedBy,
      companyId,
    } = post;

    // const companyUserGroup = await prisma.companyUserGroup.findFirst({
    //   where: {
    //     userGroupId: userGroupId,
    //   },
    // });

    const CFUData = {
      name,
      description,
      isActive,

      CreatedBy,
      clientFundId,
      userId,
      companyId,
      ClientFundUserProfileCategories: {
        upsert: [
          ...post.CFUPCategories.map((x: any) => {
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
                CreatedBy: { connect: { id: loggedInUserId } },
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
                CreatedBy: { connect: { id: loggedInUserId } },
              },
            };
          }),
        ],
      },
      ClientFundUserProfileStats: {
        upsert: [
          ...post.CFUPStats.map((x: any) => {
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
                CreatedBy: { connect: { id: loggedInUserId } },
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
                CreatedBy: { connect: { id: loggedInUserId } },
              },
            };
          }),
        ],
      },
    };

    const CFUProfile = await prisma.clientFundUserProfile.update({
      where: {
        id: id,
      },
      data: CFUData,
    });
    res.status(200).json(CFUProfile);
  } catch (error: any) {
    console.log(error);
    res.json({ mesage: error });
  }
};

export const deleteCFUProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const CUGProfile = await prisma.clientFundUserProfile.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(CUGProfile);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};
