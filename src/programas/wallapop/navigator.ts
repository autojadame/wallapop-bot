export const open = async () => {
    await window.electron.ipcRenderer.invoke('open_browser','https://es.wallapop.com/app/catalog/published')
}
