

export const getScreenshot = async (id) => {
  if(typeof window == 'undefined'){
    return await require('../main/screen').getScreenshot(id)
  }
  else{
    var canvas = document.createElement('canvas');
    const video = document.getElementById(id+"video");
    if(!video)
      return
    canvas.width = parseInt(video.style.width.replace('px',''));
    canvas.height = parseInt(video.style.height.replace('px',''));
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL()
  }
}

export const getResources = async () => {
  if(typeof window == 'undefined'){
    return await require('../main/screen').getSources()
  }
  else
    return await window.electron.ipcRenderer.invoke('sources')
}
