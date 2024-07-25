export type imgOptType = {
  imgUrl: string
  width: number
  height: number
  top: number
  left: number
  ctxDrawImageOpt: [number, number, number, number, number, number, number, number]
  screenW?: number
  screenH?: number
}

export type winAction = 'minmax' | 'closeWin'

export interface obj {
  [propsName: string]: unknown
}

export type ipcMainEvent =
  | 'desktopCapturer'
  | 'desktopCapturerWin'
  | 'popupMenuDesktopCapturerWin'
  | 'ClearDesktopCapturerWin'
  | 'ClearDesktopCapturer'
  | 'sureImg'
  | 'cancelImg'
  | 'closeWin'
  | 'pinWin'
  | 'copyCapturerImg'
  | 'minmaxWin'
  | 'randowImg'
  | 'startRecord'
  | 'stopRecord'
  | 'recordWinMouseenter'
  | 'recordWinMouseLeave'

export type initStore = {
  recordStatus?: 'start' | 'progress' | 'end' | 'init'
}
