
export const move = async (p2) => {
  await window.electron.ipcRenderer.invoke('move_mouse',p2)
}
export const click = async () => {
  await window.electron.ipcRenderer.invoke('mouse_click')
}
