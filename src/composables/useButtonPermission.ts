/**
 * 判断按钮权限，支持多个业务条件判断
 * @param permission 权限
 * @param conditions 业务条件
 * @returns 是否具有权限 false: 没有权限, true: 有权限
 */
export const useButtonPermission = (
  permission: string | string[],
  conditions: (() => boolean)[],
): ComputedRef<boolean> => {
  const menuStore = useMenuStore()

  return computed(() => {
    // 1. 检查权限
    const hasPermission = Array.isArray(permission)
      ? permission.every((p) => menuStore.buttonPermissions.includes(p))
      : menuStore.buttonPermissions.includes(permission)

    if (!hasPermission) return false

    // 2. 检查业务条件
    // 2.1 如果没有业务条件，则直接返回权限
    if (!conditions || conditions.length === 0) return hasPermission

    // 2.2 如果有业务条件，则检查是否满足所有条件 必须所有条件都为true才能通过
    const meetsAllConditions = conditions.every((condition) => condition())

    return hasPermission && meetsAllConditions
  })
}
