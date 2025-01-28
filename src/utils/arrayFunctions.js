/**
 * 
 * @param {list} arr 
 * @returns the number of elements in the array
 */
export function arrayLength(arr) {
  let res = 0;
  for (const item of arr) {
    if (Array.isArray(item)) {
      res += item.length;
    } else {
      res += 1;
    }
  }

  return res;
}

export function isArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

// array equal without orders
export function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  const setA = new Set(a);
  const setB = new Set(b);
  for (let item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }
  return true;
}

export function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}
