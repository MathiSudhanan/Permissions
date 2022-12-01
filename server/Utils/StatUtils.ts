export const getCompleteStatDetails = (profileStat: any) => {
  if (profileStat) {
    return profileStat.map((x: any) => {
      return {
        id: x.id,
        statId: x.Stat.id,
        statName: x.Stat.name,
        isPermissioned: x.isPermissioned,
        isActive: true,
      };
    });
  }
};

export const getOverridenStats = (stage2stat: any, stage1Stat: any) => {
  let result: any = [];
  if (stage1Stat) {
    result = stage1Stat.map((x: any) => {
      const hfpStat = stage2stat.find((hfS: any) => hfS.statId === x.statId);
      if (hfpStat) {
        return {
          id: hfpStat.id,
          statId: hfpStat.statId,
          statName: hfpStat.statName,
          isPermissioned: hfpStat.isPermissioned,
          isActive: true,
        };
      } else {
        return {
          id: x.id,
          statId: x.statId,
          statName: x.statName,
          isPermissioned: x.isPermissioned,
          isActive: true,
        };
      }
    });
  }

  if (stage2stat) {
    result = [
      ...result,
      ...stage2stat
        .filter((s: any) => {
          if (result.length) {
            return result.findIndex((x: any) => x.statId === s.statId) < 0;
          } else {
            return true;
          }
        })
        .map((st: any) => {
          return {
            id: st.id,
            statId: st.statId,
            statName: st.statName,
            isPermissioned: st.isPermissioned,
            isActive: true,
          };
        }),
    ];
  }
  return result;
};

export const getMostRestrictiveStats = (stage2stat: any, stage1Stat: any) => {
  let result: any = [];
  if (stage1Stat) {
    result = stage1Stat.map((x: any) => {
      const hfpStat = stage2stat.find((hfS: any) => hfS.statId === x.statId);
      if (hfpStat && x.isPermissioned) {
        return {
          id: hfpStat.id,
          statId: hfpStat.statId,
          statName: hfpStat.statName,
          isPermissioned: hfpStat.isPermissioned,
          isActive: true,
        };
      } else {
        return {
          id: x.id,
          statId: x.statId,
          statName: x.statName,
          isPermissioned: x.isPermissioned,
          isActive: true,
        };
      }
    });
  }
  if (stage2stat) {
    result = [
      ...result,
      ...stage2stat
        .filter((s: any) => {
          if (result.length) {
            return result.findIndex((x: any) => x.statId === s.statId) < 0;
          } else {
            return true;
          }
        })
        .map((st: any) => {
          return {
            id: st.id,
            statId: st.statId,
            statName: st.statName,
            isPermissioned: st.isPermissioned,
            isActive: true,
          };
        }),
    ];
  }
  return result;
};

export const getMissedOutStats = (finalProfileStats: any, stats: any) => {
  return stats.map((mStat: any) => {
    const stat = finalProfileStats?.find((x: any) => mStat.id === x.statId);
    if (stat) {
      return {
        id: stat.id,
        statId: stat.statId,
        statName: stat.statName,
        isPermissioned: stat.isPermissioned,
        isActive: true,
      };
    } else {
      return {
        id: "",
        statId: mStat.id,
        statName: mStat.name,
        isPermissioned: null,
        isActive: true,
      };
    }
  });
};

export const getOverridenStatsFP = (stage2stat: any, stage1Stat: any) => {
  let result: any = [];
  if (stage1Stat) {
    result = stage1Stat.map((x: any) => {
      const hfpStat = stage2stat.find((hfS: any) => hfS.statId === x.statId);
      if (hfpStat) {
        return {
          id: hfpStat.id,
          statId: hfpStat.statId,
          statName: hfpStat.statName,
          isPermissioned: hfpStat.isPermissioned,
          isActive: true,
          chipData: hfpStat.chipData,
        };
      } else {
        return {
          id: x.id,
          statId: x.statId,
          statName: x.statName,
          isPermissioned: x.isPermissioned,
          isActive: true,
          chipData: x.chipData,
        };
      }
    });
  }

  if (stage2stat) {
    result = [
      ...result,
      ...stage2stat
        .filter((s: any) => {
          if (result.length) {
            return result.findIndex((x: any) => x.statId === s.statId) < 0;
          } else {
            return true;
          }
        })
        .map((st: any) => {
          return {
            id: st.id,
            statId: st.statId,
            statName: st.statName,
            isPermissioned: st.isPermissioned,
            isActive: true,
            chipData: st.chipData,
          };
        }),
    ];
  }
  return result;
};

export const getMostRestrictiveStatsFP = (stage2stat: any, stage1Stat: any) => {
  let result: any = [];
  if (stage1Stat) {
    result = stage1Stat.map((x: any) => {
      const hfpStat = stage2stat.find((hfS: any) => hfS.statId === x.statId);
      if (hfpStat && x.isPermissioned) {
        return {
          id: hfpStat.id,
          statId: hfpStat.statId,
          statName: hfpStat.statName,
          isPermissioned: hfpStat.isPermissioned,
          isActive: true,
          chipData: hfpStat.chipData,
        };
      } else {
        return {
          id: x.id,
          statId: x.statId,
          statName: x.statName,
          isPermissioned: x.isPermissioned,
          isActive: true,
          chipData: x.chipData,
        };
      }
    });
  }
  if (stage2stat) {
    result = [
      ...result,
      ...stage2stat
        .filter((s: any) => {
          if (result.length) {
            return result.findIndex((x: any) => x.statId === s.statId) < 0;
          } else {
            return true;
          }
        })
        .map((st: any) => {
          return {
            id: st.id,
            statId: st.statId,
            statName: st.statName,
            isPermissioned: st.isPermissioned,
            isActive: true,
            chipData: st.chipData,
          };
        }),
    ];
  }
  return result;
};

export const getCompleteStatDetailsFP = (profileStat: any, level: number) => {
  if (profileStat) {
    return profileStat.map((x: any) => {
      return {
        id: x.id,
        statId: x.Stat.id,
        statName: x.Stat.name,
        isPermissioned: x.isPermissioned,
        isActive: true,
        chipData: [
          {
            bp: level === 1 ? x.isPermissioned : null,
            cugp: level === 2 ? x.isPermissioned : null,
            hfp: level === 3 ? x.isPermissioned : null,
            cfugp: level === 4 ? x.isPermissioned : null,
            cfup: level === 5 ? x.isPermissioned : null,
          },
        ],
      };
    });
  }
};
