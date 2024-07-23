import { FC, useState, useEffect } from 'react'
// import { imgOptType } from 'src/types/type'
// import closeRe from '../../img/closeRe.png'
// // import check from '../../img/check.png'
// import pin from '../../img/pin.png'
// import pinSel from '../../img/pinSel.png'
import './desktopCapturerWin.css'
const DesktopCapturerwin: FC = (): JSX.Element => {
  const [bg, setBg] = useState('')
  // const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  // const [pinStatus, setPinStatus] = useState(false)
  // const [screenOpt, setScreenOpt] = useState<{ screenW: number; screenH: number }>({
  //   screenW: 0,
  //   screenH: 0
  // })
  const ipcMainCallBack = (data): void => {
    setBg(data.imgUrl)
    // setScreenOpt({ screenH: data.screenH as number, screenW: data.screenW as number })
    // setBg({ backgroundImage: `url(${data.imgUrl})` })
    // setPos({ top: data.top, left: data.left })
  }
  // 右键菜单，有bug待修复
  // const onContextMenuMenu = (e: React.MouseEvent): void => {
  //   window.api.sendIpcMain('popupMenuDesktopCapturerWin')
  //   e.preventDefault()
  // }
  // const sureImg = (): void => {
  //   window.api.sendIpcMain('sureImg')
  // }
  // const cancelImg = (): void => {
  //   console.log(0)
  //   window.api.sendIpcMain('cancelImg')
  // }

  // const pinScreen = (): void => {
  //   setPinStatus(!pinStatus)
  //   window.api.sendIpcMain('pinWin')
  // }
  // const positionSty = useMemo(() => {
  //   return {
  //     backgroundSize: `${screenOpt.screenW}px ${screenOpt.screenH}px`,
  //     backgroundPosition: `-${pos.left}px -${pos.top}px`
  //   }
  // }, [pos])
  useEffect(() => {
    window.api.onIcpMainEvent('showDesktopCapturerWin', ipcMainCallBack)
  }, [])
  return (
    <div className="desktopCapturer-win drag">
      <img
        src={bg}
        alt=""
        style={{ width: 'calc(100vw - 4px)', height: 'calc(100vh - 4px)' }}
        srcSet=""
      />
    </div>
  )
}

export default DesktopCapturerwin
