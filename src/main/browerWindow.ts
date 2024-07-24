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
      ;(this.win as BrowserWindow).hookWindowMessage(278, () => {
        ;(this.win as BrowserWindow).setEnabled(false) //窗口禁用
        const timer = setTimeout(() => {
          ;(this.win as BrowserWindow).setEnabled(true)
          clearTimeout(timer)
        }, 100) // 延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
        return true
      })
    })
    this.win.setMaximizable(false)
    this.win.setResizable(false)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/' + winUrl)
    } else {
      this.win.loadFile(join(__dirname, '../renderer/index.html' + '/#/' + winUrl))
    }
  }

  sendEventWeb(msg: string, data?: unknown): void {
    this.win?.webContents.on('dom-ready', () => {
      this.win?.webContents.send(msg, data)
    })
  }

  setWindowOpt(data: unknown): void {
    this.win?.webContents.on('did-finish-load', () => {
      this.win?.webContents.executeJavaScript(`window.screenOpt=${JSON.stringify(data)}`)
    })
  }

  closeWin(): void {
    this.win?.destroy()
    this.win = null
  }

  getVm(): BrowserWindow {
    return this.win as BrowserWindow
  }
}

export default CustomerBrowerWindow
