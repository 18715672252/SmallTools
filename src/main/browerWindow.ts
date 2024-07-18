import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
class CustomerBrowerWindow {
  options: Electron.BrowserWindowConstructorOptions
  win: BrowserWindow | null
  winUrl: string
  defaultOpt: Electron.BrowserWindowConstructorOptions
  constructor(options: Electron.BrowserWindowConstructorOptions = {}, winUrl: string) {
    this.defaultOpt = {
      ...(process.platform === 'linux' ? { icon } : {}),
      backgroundColor: '#f5f8ff',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    }
    this.options = { ...options, ...this.defaultOpt }
    this.winUrl = winUrl
    this.win = new BrowserWindow(this.options)
    this.win.on('ready-to-show', () => {
      ;(this.win as BrowserWindow).show()
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/' + winUrl)
    } else {
      this.win.loadFile(join(__dirname, '../renderer/index.html' + '/#/' + winUrl))
    }
    global[winUrl] = this.win.id
    console.log(global[winUrl], 'pp')
  }

  sendEventWeb(msg: string, data?: unknown): void {
    this.win?.webContents.on('dom-ready', () => {
      this.win?.webContents.send(msg, data)
    })
  }
}

export default CustomerBrowerWindow

