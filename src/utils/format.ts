/**
 * 轉換千分位
 * @param {string} value - 金額
 * @returns {string} 格式化的金額字串
 */
function thousandsFormatting (value: string | number): string | null {
  const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
  return value ? value.toString().replace(comma, ',') : null
}

export {
  thousandsFormatting, // 轉換千分位
}
