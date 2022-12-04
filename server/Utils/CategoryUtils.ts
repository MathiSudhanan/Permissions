export const getCompleteCatgoryDetails = (profileCat: any) => {
  if (profileCat) {
    return profileCat.map((x: any) => {
      return {
        id: x.id,
        Category: x.Category,
        categoryId: x.Category.id,
        categoryName: x.Category.name,
        isPermissioned: x.isPermissioned,
        isActive: true,
      };
    });
  }
};

export const getOverridenCategories = (stage2Cat: any, stage1Cat: any) => {
  let result: any = [];
  if (stage1Cat) {
    result = stage1Cat.map((st1Cat: any) => {
      const cat = stage2Cat?.find(
        (x: any) => st1Cat.categoryId === x.categoryId
      );

      if (cat) {
        return {
          id: cat.id,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          isPermissioned: cat.isPermissioned,
          isActive: true,
        };
      } else {
        return {
          id: st1Cat.id,
          categoryId: st1Cat.categoryId,
          categoryName: st1Cat.categoryName,
          isPermissioned: st1Cat.isPermissioned,
          isActive: true,
        };
      }
    });
  }
  if (stage2Cat) {
    result = [
      ...result,
      ...stage2Cat
        .filter((x: any) => {
          return (
            result.findIndex((c: any) => c.categoryId === x.categoryId) < 0
          );
        })
        .map((cat: any) => {
          return {
            id: cat.id,
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            isPermissioned: cat.isPermissioned,
            isActive: true,
          };
        }),
    ];
  }
  return result;
};

export const getMostRestrictiveCategories = (
  stage2Cat: any,
  stage1Cat: any
) => {
  let result: any = [];

  if (stage1Cat) {
    result = stage1Cat.map((st1Cat: any) => {
      const cat = stage2Cat?.find(
        (x: any) => st1Cat.categoryId === x.categoryId
      );

      if (cat && st1Cat.isPermissioned) {
        return {
          id: cat.id,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          isPermissioned: cat.isPermissioned,
          isActive: true,
        };
      } else {
        return {
          id: st1Cat.id,
          categoryId: st1Cat.categoryId,
          categoryName: st1Cat.categoryName,
          isPermissioned: st1Cat.isPermissioned,
          isActive: true,
        };
      }
    });
  }
  if (stage2Cat) {
    result = [
      ...result,
      ...stage2Cat
        .filter((x: any) => {
          return (
            result.findIndex((c: any) => c.categoryId === x.categoryId) < 0
          );
        })
        .map((cat: any) => {
          return {
            id: cat.id,
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            isPermissioned: cat.isPermissioned,
            isActive: true,
          };
        }),
    ];
  }
  return result;
};

export const getMissedOutCategories = (
  finalProfileCategories: any,
  categories: any
) => {
  return categories.map((mCat: any) => {
    const cat = finalProfileCategories?.find(
      (x: any) => mCat.id === x.categoryId
    );

    if (cat) {
      return {
        id: cat.id,
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        isPermissioned: cat.isPermissioned,
        isActive: true,
      };
    } else {
      return {
        id: "",
        categoryId: mCat.id,
        categoryName: mCat.name,
        isPermissioned: null,
        isActive: true,
      };
    }
  });
};

export const getOverridenCategoriesFP = (
  stage2Cat: any,
  stage1Cat: any,
  level: number
) => {
  let result: any = [];
  if (stage1Cat) {
    result = stage1Cat.map((st1Cat: any) => {
      const cat = stage2Cat?.find(
        (x: any) => st1Cat.categoryId === x.categoryId
      );
      if (cat) {
        return {
          id: cat.id,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          isPermissioned: cat.isPermissioned,
          isActive: true,
          chipData:
            st1Cat.chipData.length > 0
              ? [...cat.chipData, ...st1Cat.chipData]
              : [...cat.chipData],
        };
      } else {
        return {
          id: st1Cat.id,
          categoryId: st1Cat.categoryId,
          categoryName: st1Cat.categoryName,
          isPermissioned: st1Cat.isPermissioned,
          isActive: true,
          chipData: [...st1Cat.chipData],
        };
      }
    });
  }
  if (stage2Cat) {
    result = [
      ...result,
      ...stage2Cat
        .filter((x: any) => {
          return (
            result.findIndex((c: any) => c.categoryId === x.categoryId) < 0
          );
        })
        .map((cat: any) => {
          let cData = [];

          return {
            id: cat.id,
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            isPermissioned: cat.isPermissioned,
            isActive: true,
            chipData: cat.chipData,
          };
        }),
    ];
  }
  return result;
};

export const getMostRestrictiveCategoriesFP = (
  stage2Cat: any,
  stage1Cat: any,
  level: number
) => {
  let result: any = [];

  if (stage1Cat) {
    result = stage1Cat.map((st1Cat: any) => {
      const cat = stage2Cat?.find(
        (x: any) => st1Cat.categoryId === x.categoryId
      );

      if (cat && st1Cat.isPermissioned) {
        return {
          id: cat.id,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          isPermissioned: cat.isPermissioned,
          isActive: true,
          // chipData: [...cat.chipData, ...st1Cat.chipData],
          chipData:
            st1Cat.chipData.length > 0
              ? [...cat.chipData, ...st1Cat.chipData]
              : [...cat.chipData],
        };
      } else {
        return {
          id: st1Cat.id,
          categoryId: st1Cat.categoryId,
          categoryName: st1Cat.categoryName,
          isPermissioned: st1Cat.isPermissioned,
          isActive: true,
          chipData: [...st1Cat.chipData],
        };
      }
    });
  }
  if (stage2Cat) {
    result = [
      ...result,
      ...stage2Cat
        .filter((x: any) => {
          return (
            result.findIndex((c: any) => c.categoryId === x.categoryId) < 0
          );
        })
        .map((cat: any) => {
          let cData = [];
          return {
            id: cat.id,
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            isPermissioned: cat.isPermissioned,
            isActive: true,
            chipData: cat.chipData,
          };
        }),
    ];
  }
  return result;
};

export const getCompleteCatgoryDetailsFP = (profileCat: any, level: number) => {
  if (profileCat) {
    return profileCat.map((x: any) => {
      return {
        id: x.id,
        Category: x.Category,
        categoryId: x.Category.id,
        categoryName: x.Category.name,
        isPermissioned: x.isPermissioned,
        isActive: true,
        chipData: [getChipLevelData(level, x.isPermissioned)],
      };
    });
  }
};

const getChipLevelData = (level: number, isPermissioned: boolean) => {
  let chipData = {};
  switch (level) {
    case 1:
      return {
        name: "bp",
        value: isPermissioned,
      };

    case 2:
      return {
        name: "cugp",
        value: isPermissioned,
      };

    case 3:
      return {
        name: "hfp",
        value: isPermissioned,
      };

    case 4:
      return {
        name: "cfugp",
        value: isPermissioned,
      };

    case 5:
      return {
        name: "cfup",
        value: isPermissioned,
      };
  }
};
