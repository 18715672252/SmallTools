import React, { FC, useCallback, useEffect } from 'react'
import { imgOptType } from '../../../../types/type'
import Screenshots from 'react-screenshots'
import 'react-screenshots/lib/style.css'
import '../../assets/icon.css'
interface Bounds {
  x: number
  y: number
  width: number
  height: number
}
const ReactScreenshots: FC = () => {
  const [imgUrl, setImgUrl] = React.useState('')
  const ipcMainCallBack = (data: imgOptType): void => {
    setImgUrl(data.imgUrl)
  }
  const domref = React.useRef<HTMLDivElement | null>(null)
  const onSave = useCallback((blob: Blob, bounds: Bounds) => {
    blob.arrayBuffer().then((bf) => {
      window.api.sendIpcMain('desktopCapturerWin', { blob: bf, ...bounds })
      window.api.sendIpcMain('ClearDesktopCapturer')
    })
  }, [])
  const onCancel = (): void => {
    window.api.sendIpcMain('closeWin')
  }
  const onOk = useCallback((blob: Blob) => {
    blob.arrayBuffer().then((bf) => {
      window.api.sendIpcMain('copyCapturerImg', { blob: bf })
      window.api.sendIpcMain('ClearDesktopCapturer')
    })
  }, [])
  useEffect(() => {
    window.api.onIcpMainEvent('sendMsg', ipcMainCallBack)
    domref.current!.onclick = (e): void => {
      // console.log(((e.target as HTMLElement).className.includes('screenshots-background-mask'))
      if ((e.target as HTMLElement).className.includes('screenshots-background-mask')) {
        // window.api.sendIpcMain('closeWin')
        const sel: NodeListOf<HTMLDivElement> = document.querySelectorAll(
          '.screenshots-magnifier-footer-item'
        )
        window.api.sendIpcMain('copyColor', sel[1].innerHTML.substring(4))
        window.api.sendIpcMain('closeWin')
      }
    }
  }, [])
  return (
    <div ref={domref}>
      <Screenshots
        url={imgUrl}
        width={window.innerWidth}
        height={window.innerHeight}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
        lang={{
          operation_redo_title: '钉一下'
        }}
      />
    </div>
  )
}

export default ReactScreenshots
