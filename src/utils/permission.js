// helpers/permission.js
export function hasAnyPermission(required = [], userPermissions = []) {
    if (!required || required.length === 0) return true; // publik jika tidak ada permission
    return required.some(p => userPermissions.includes(p));
  }