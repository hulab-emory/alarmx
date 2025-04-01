/**
 * 
 * @param {Array<String>} prevent 
 */
export function clearLocalStorage(prevent) {
  if (prevent.length === 0) {
    localStorage.clear();
    return
  }
  Object.keys(localStorage).forEach((key) => {
    if (!prevent.includes(key)) {
      localStorage.removeItem(key);
    }
  })
}