import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/appIcon.png?asset'
class CustomerBrowerWindow {
  options: Electron.BrowserWindowConstructorOptions
  win: BrowserWindow | null
  winUrl: string
  defaultOpt: Electron.BrowserWindowConstructorOptions
  constructor(options: Electron.BrowserWindowConstructorOptions = {}, winUrl: string) {
    this.defaultOpt = {
      ...(process.platform === 'linux' ? { icon } : {}),
      // backgroundColor: '#f5f8ff',
      icon,
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
    // 管理win的map对象
    global.winMap
      ? (global.winMap[this.win.id] = this)
      : (global.winMap = {
          [this.win.id]: this
        })
    this.win.on('closed', () => {
      global.winMap[this.win!.id] = null
      delete global.winMap[this.win!.id]
    })
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

  closeWin(): void {
    this.win?.destroy()
    this.win = null
  }

  getVm(): BrowserWindow {
    return this.win as BrowserWindow
  }

  getWinId(): number {
    return this.win?.id as number
  }

  hideWinOutside({ x, y }): void {
    x = x || this.options.x
    y = y || this.options.y
    this.win!.setPosition(x, y)
  }

  sendRenderEvent(eventType: string, winId: number, data?: unknown): void {
    BrowserWindow.fromId(winId)?.webContents.send(eventType, data)
  }
}

export default CustomerBrowerWindow
