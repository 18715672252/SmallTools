import { ipcMain, desktopCapturer, screen, app, BrowserWindow } from 'electron'
import CustomerBrowerWindow from './browerWindow'
let desktopCapturerSize: undefined | Electron.Size
let desktopCapturerWin
app.whenReady().then(() => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const aa = screen.getPrimaryDisplay().size
  desktopCapturerSize = {
    width: screenSize.width,
    height: screenSize.height
  }
  console.log(aa)
  console.log(desktopCapturerSize)
})
ipcMain.handle('desktopCapturer', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: desktopCapturerSize
  })
  console.log(sources)
  const imgUrl = sources[0].thumbnail.resize(desktopCapturerSize as Electron.Size).toDataURL()
  desktopCapturerWin = new CustomerBrowerWindow(
    {
      ...desktopCapturerSize,
      frame: false,
      show: false,
      resizable: false
      //   fullscreen: true
    },
    'desktopCapturer'
  )
  desktopCapturerWin.sendEventWeb('sendMsg', { imgUrl, ...desktopCapturerSize })
  return imgUrl
})

ipcMain.handle('desktopCapturerWin', (_ev, data) => {
  new CustomerBrowerWindow(
    {
      frame: false,
      show: false,
      resizable: false,
      parent: desktopCapturerWin,
      x: data.left,
      y: data.top,
      width: data.width,
      height: data.height
      //   fullscreen: true
    },
    'desktopCapturerWin'
  )
})
