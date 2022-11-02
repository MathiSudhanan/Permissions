export const groupBy = (xs: any, key: string) => {
  return xs.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const sortStatArray = (array: any) => {
  array = array.sort((current: any, next: any) => {
    if (current.statName < next.statName) {
      return -1;
    } else if (current.statName > next.statName) {
      return 1;
    }
    return 0;
  });

  return array;
};

export const sortCategoryArray = (array: any) => {
  array = array.sort((current: any, next: any) => {
    if (current.categoryName < next.categoryName) {
      return -1;
    } else if (current.categoryName > next.categoryName) {
      return 1;
    }
    return 0;
  });

  return array;
};
