import prisma from "../lib/prisma";
import {
  getCompleteCatgoryDetailsFP,
  getMostRestrictiveCategoriesFP,
  getOverridenCategoriesFP,
} from "../Utils/CategoryUtils";
import {
  getCompleteStatDetailsFP,
  getMostRestrictiveStatsFP,
  getOverridenStatsFP,
} from "../Utils/StatUtils";

export const getFinalPermissions = async (req: any, res: any) => {
  const { clientFundId, userId } = req.params;

  try {
    const clientFund = await prisma.clientFunds.findUnique({
      where: {
        id: clientFundId,
      },
    });

    const userGroupMapping = await prisma.userGroupMapping.findFirst({
      where: {
        userId: userId,
      },
    });

    if (clientFund && userGroupMapping) {
      const companyUserGroup = await prisma.companyUserGroup.findFirst({
        where: {
          userGroupId: userGroupMapping?.userGroupId,
        },
      });

      const fundId = clientFund?.fundId;
      const companyId = companyUserGroup?.companyId;
      const companyUserGroupId = companyUserGroup?.id;

      const cugProfile = await prisma.cUGProfile.findFirst({
        where: {
          companyUserGroupId: companyUserGroupId,
        },
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
          BaseProfile: true,
        },
      });

      const baseProfile = await prisma.baseProfiles.findUnique({
        where: {
          id: cugProfile?.baseProfileId,
        },
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

      const hfProfile = await prisma.hedgeFundProfile.findFirst({
        where: {
          fundId: fundId,
        },
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

      const cfugProfile = await prisma.clientFundUserGroupProfile.findFirst({
        where: {
          clientFundId: clientFundId,
        },
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

      const cfuProfile = await prisma.clientFundUserProfile.findFirst({
        where: {
          clientFundId: clientFundId,
        },
        include: {
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

      let cfuProfileStats = getCompleteStatDetailsFP(
        cfuProfile?.ClientFundUserProfileStats,
        5
      );
      let cfuProfileCategories = getCompleteCatgoryDetailsFP(
        cfuProfile?.ClientFundUserProfileCategories,
        5
      );

      let cfugProfileStats = getCompleteStatDetailsFP(
        cfugProfile?.ClientFundUserGroupProfileStats,
        4
      );
      let cfugProfileCategories = getCompleteCatgoryDetailsFP(
        cfugProfile?.ClientFundUserGroupProfileCategories,
        4
      );
      let hfProfileStats = getCompleteStatDetailsFP(
        hfProfile?.HedgeFundProfileStats,
        3
      );
      let hfProfileCategories = getCompleteCatgoryDetailsFP(
        hfProfile?.HedgeFundProfileCategories,
        3
      );
      let cugProfileStats = getCompleteStatDetailsFP(
        cugProfile?.CUGProfileStats,
        2
      );
      let cugProfileCategories = getCompleteCatgoryDetailsFP(
        cugProfile?.CUGProfileCategories,
        2
      );
      let baseProfileStats = getCompleteStatDetailsFP(
        baseProfile?.BaseProfileStats,
        1
      );
      let baseProfileCategories = getCompleteCatgoryDetailsFP(
        baseProfile?.BaseProfileCategories,
        1
      );

      if (cugProfile) {
        if (cugProfileStats) {
          cugProfileStats = getOverridenStatsFP(
            cugProfileStats,
            baseProfileStats
          );
        }

        if (cugProfileCategories) {
          cugProfileCategories = getOverridenCategoriesFP(
            cugProfileCategories,
            baseProfileCategories,
            2
          );
        }
      }

      if (hfProfile) {
        if (hfProfileStats) {
          hfProfileStats = getMostRestrictiveStatsFP(
            hfProfileStats,
            cugProfileStats
          );
        } else {
          hfProfileStats = cugProfileStats;
        }

        if (hfProfileCategories) {
          hfProfileCategories = getMostRestrictiveCategoriesFP(
            hfProfileCategories,
            cugProfileCategories,
            3
          );
        } else {
          hfProfileCategories = cugProfileCategories;
        }
      } else {
        hfProfileStats = cugProfileStats;
        hfProfileCategories = cugProfileCategories;
      }

      if (cfugProfile) {
        if (cfugProfile?.ClientFundUserGroupProfileCategories) {
          cfugProfileCategories = getOverridenCategoriesFP(
            cfugProfileCategories,
            hfProfileCategories,
            4
          );
        }

        if (cfugProfile?.ClientFundUserGroupProfileStats) {
          cfugProfileStats = getOverridenStatsFP(
            cfugProfileStats,
            hfProfileStats
          );
        }
      } else {
        cfugProfileCategories = hfProfileCategories;
        cfugProfileStats = hfProfileStats;
      }

      if (cfuProfile) {
        if (cfuProfile?.ClientFundUserProfileCategories) {
          cfuProfileCategories = getOverridenCategoriesFP(
            cfuProfileCategories,
            cfugProfileCategories,
            5
          );
        }

        if (cfuProfile?.ClientFundUserProfileStats) {
          cfuProfileStats = getOverridenStatsFP(
            cfuProfileStats,
            cfugProfileStats
          );
        }
      } else {
        cfuProfileCategories = cfugProfileCategories;
        cfuProfileStats = cfugProfileStats;
      }

      const finalPermissions = {
        FinalPermissionsCategories: cfuProfileCategories,
        FinalPermissionsStats: cfuProfileStats,
      };

      console.log("fp", finalPermissions);

      res.status(200).json(finalPermissions);
    } else {
      const finalPermissions = {
        FinalPermissionsCategories: [],
        FinalPermissionsStats: [],
      };
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ mesage: error });
  }
};
