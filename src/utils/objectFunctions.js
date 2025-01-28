/**
 * 
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @returns if obj1 and obj2 are equal, return true, if not return false
 */
export function isEqual(obj1, obj2) {

  if (obj1 === null && obj2 === null) {
    return true;
  }

  if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
    return false;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  // 如果是基本数据类型，则直接比较值
  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  // 如果是数组，则递归比较每个元素
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      if (!isEqual(obj1[i], obj2[i])) {
        return false;
      }
    }

    return true;
  }

  // 如果是对象，则递归比较每个属性
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * 
 * @param {Object} obj 
 * @returns an array that contains every key value pair of the object
 */
export function object2list(obj) {
  return Object.keys(obj).map(key => {
    return {
      key: key,
      value: obj[key]
    }
  })
}