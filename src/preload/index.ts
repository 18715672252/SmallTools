import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { imgOptType } from '../types/type'
// Custom APIs for renderer
const api = {
  sendIpcMain(eventType: string, data?: unknown): Promise<unknown> {
    return ipcRenderer.invoke(eventType, data)
  },
  onIcpMainEvent(eventType: string, cb: (arg: imgOptType) => void): void {
    ipcRenderer.on(eventType, (_event, data: imgOptType) => {
      cb(data)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
