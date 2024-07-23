import { ElectronAPI } from '@electron-toolkit/preload'
import { imgOptType } from '../types/type'
type apiType = {
  sendIpcMain: (eventType: string, data?: unknown) => Promise<unknown>
  onIcpMainEvent: (eventType: string, cb: (arg: imgOptType) => void) => void
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: apiType
    screenOpt: string
  }
}
