import {
  ipcMain,
  desktopCapturer,
  screen,
  app,
  Menu,
  BrowserWindow,
  nativeImage,
  clipboard,
  net,
  Notification
} from 'electron'
import CustomerBrowerWindow from './browerWindow'
import fs from 'fs'
let desktopCapturerSize: undefined | Electron.Size
let desktopCapturerWin
let showDesktopCapturerWin
let screenSize: Electron.Rectangle
let notice: Notification
app.whenReady().then(() => {
  // const screenSize = screen.getPrimaryDisplay().size
  screenSize = screen.getPrimaryDisplay().bounds
  const scaleFactor = screen.getPrimaryDisplay().scaleFactor
  console.log(screenSize)
  desktopCapturerSize = {
    width: screenSize.width * scaleFactor,
    height: screenSize.height * scaleFactor
  }
})
ipcMain.handle('desktopCapturer', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: desktopCapturerSize
  })
  // const imgUrl = sources[0].thumbnail.resize({ width: 1536, height: 864 }).toDataURL()
  const imgUrl = sources[0].thumbnail.toDataURL()
  // 全屏图片的窗口
  desktopCapturerWin = new CustomerBrowerWindow(
    {
      width: screenSize.width,
      height: screenSize.height,
      fullscreen: true,
      frame: false,
      show: false
      // resizable: false
    },
    'desktopCapturer'
  )
  desktopCapturerWin.sendEventWeb('sendMsg', { imgUrl, ...desktopCapturerSize })
  // desktopCapturerWin.sendEventWeb('cancelImg')
  return imgUrl
})

// 截图显示的窗口
ipcMain.handle('desktopCapturerWin', async (_ev, { x, y, width, height, blob }) => {
  showDesktopCapturerWin = new CustomerBrowerWindow(
    {
      frame: false,
      show: false,
      resizable: false,
      parent: desktopCapturerWin,
      x,
      y,
      width: width,
      height: height,
      transparent: true,
      alwaysOnTop: true
      //   fullscreen: true
    },
    'desktopCapturerWin'
  )
  const aa = Buffer.from(blob)
  const url = nativeImage.createFromBuffer(aa).toDataURL()
  // showDesktopCapturerWin.sendEventWeb('showDesktopCapturerWin', {
  //   ...data,
  //   ...{ screenW: screenSize.width, screenH: screenSize.height }
  // })
  showDesktopCapturerWin.sendEventWeb('showDesktopCapturerWin', { imgUrl: url })
})

ipcMain.handle('popupMenuDesktopCapturerWin', (e: Electron.IpcMainInvokeEvent) => {
  const t = [{ label: '钉一下' }, { label: '复制' }]
  const menu = Menu.buildFromTemplate(t)
  menu.popup({
    window: BrowserWindow.fromWebContents(e.sender) as BrowserWindow
  })
})

ipcMain.handle('ClearDesktopCapturerWin', () => {
  if (showDesktopCapturerWin) {
    showDesktopCapturerWin.closeWin()
    showDesktopCapturerWin = null
  }
})

ipcMain.handle('ClearDesktopCapturer', () => {
  if (desktopCapturerWin) {
    desktopCapturerWin.closeWin()
    desktopCapturerWin = null
  }
})

ipcMain.handle('sureImg', () => {
  if (desktopCapturerWin) {
    desktopCapturerWin.closeWin()
    desktopCapturerWin = null
  }
})

ipcMain.handle('cancelImg', () => {
  if (showDesktopCapturerWin) {
    showDesktopCapturerWin.closeWin()
    showDesktopCapturerWin = null
  }
  if (!desktopCapturerWin) return
  const webContxet = desktopCapturerWin.getVm()
  webContxet.send('cancelImg')
})

ipcMain.handle('closeWin', (ev) => {
  const win = BrowserWindow.fromWebContents(ev.sender)
  win?.destroy()
})

ipcMain.handle('pinWin', (ev) => {
  const win = BrowserWindow.fromWebContents(ev.sender)
  win?.setAlwaysOnTop(!win?.isAlwaysOnTop())
})

ipcMain.handle('copyCapturerImg', (_ev, { blob }) => {
  const buffer = Buffer.from(blob)
  const img = nativeImage.createFromBuffer(buffer)
  clipboard.writeImage(img)
})

ipcMain.handle('minmaxWin', (ev) => {
  const win = BrowserWindow.fromWebContents(ev.sender)
  win?.minimize()
})

ipcMain.handle('randowImg', (_event, data) => {
  const time = Date.now()
  const path = app.getPath('desktop')
  const request = net.request(data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bufs: Array<any> = []
  request.on('response', (response) => {
    response.on('data', (chunk) => {
      // console.log(chunk)
      bufs.push(chunk)
    })
    response.on('end', async () => {
      const buf = Buffer.concat(bufs)
      await fs.promises.writeFile(`${path}/${time}.${'png'}`, buf)
      _event.sender.send('img-download-finsh')
      notice = new Notification({
        title: '图片下载完成',
        body: '图片已经保存到桌面',
        // icon
      })
      notice.show()
      console.log('No more data in response.')
    })
  })
  request.end()
  return undefined
})
