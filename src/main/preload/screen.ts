import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

ipcRenderer.on('screenshot',async (evnt,id)=>{
  var canvas = document.createElement('canvas');
  const video = document.getElementById(id+"video");
  canvas.width = parseInt(video.style.width.replace('px',''));
  canvas.height = parseInt(video.style.height.replace('px',''));
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ipcRenderer.send('screenshot'+id,canvas.toDataURL())
})
ipcRenderer.on('SET_SOURCE', async (event, source) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.source.id
        }
      }
    })
    var widthScreen = source.display.bounds.width * source.display.scaleFactor
    var heightScreen = source.display.bounds.height * source.display.scaleFactor
    handleStream(stream,source.source.display_id,widthScreen,heightScreen)
  } catch (e) {
    console.error(e)
  }
})


function handleStream (stream,sourceId,widthScreen,heightScreen) {
    var video = document.getElementById(sourceId+"video")
    if(video == undefined){
      video = document.createElement('video');
      video.setAttribute("id", sourceId+"video");
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
      video.onloadedmetadata = function () {
          // Set video ORIGINAL height (screenshot)
          video.style.height = heightScreen + 'px'; // videoHeight
          video.style.width = widthScreen + 'px'; // videoWidth
          video.play();
      }
      video.srcObject = stream;
      document.body.appendChild(video);
    }
    else{
      video.srcObject = stream;
    }
}
