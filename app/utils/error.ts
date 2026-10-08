/** 從 catch 到的任意值取出可顯示的錯誤訊息 */
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
