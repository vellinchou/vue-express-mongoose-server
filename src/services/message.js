export function message(e, type, tip) {
  e.$message({
    message: tip,
    type: type || 'success'
  })
}
