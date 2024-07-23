import React, { FC } from 'react'
import { imgOptType } from '../../../../types/type'
import './desktopCapturer.css'
const obj = {
  top: 0,
  left: 0,
  width: 0,
  height: 0
}

let timer: NodeJS.Timeout | unknown = null

type objType = {
  top: number
  left: number
  width: number
  height: number
}
const DesktopCapturer: FC = (): JSX.Element => {
  const [imgUrl, setImgUrl] = React.useState('')
  const [mousePos, setMousePos] = React.useState<objType>(obj)
  const [moveFlag, setMoveFlag] = React.useState(false)
  const [show, setShow] = React.useState(false)
  const [showFlag, setShowFlag] = React.useState(false)
  const img = React.useRef<HTMLImageElement | null>(null)
  const ipcMainCallBack = (data: imgOptType): void => {
    setImgUrl(data.imgUrl)
  }
  const cancelImgCallBack = (): void => {
    setShow(false)
    setShowFlag(false)
  }
  const desktopCapturerMouseDown = (e: React.MouseEvent): void => {
    const { pageX, pageY } = e
    console.log(pageX, pageY)
    setMousePos({
      ...mousePos,
      top: pageY,
      left: pageX
    })
    setMoveFlag(true)
    setShow(false)
    setShowFlag(false)
    window.api.sendIpcMain('ClearDesktopCapturerWin')
  }

  const onContextMenuCancel = (): void => {
    window.api.sendIpcMain('closeWin')
  }

  const desktopCapturerMouseMove = (e: React.MouseEvent): void => {
    const { pageX, pageY } = e
    const width = pageX - mousePos.left
    const height = pageY - mousePos.top
    if (moveFlag && width > 10 && height > 10) {
      if (!show) setShow(true)
        // window.api.sendIpcMain('ClearDesktopCapturerWin')
      setMousePos(obj)

      setMousePos({
        ...mousePos,
        width,
        height
      })
      clearTimeout(timer as NodeJS.Timeout)
      timer = setTimeout(() => {
        const ctxDrawImageOpt = [
          mousePos.left * 1.25,
          mousePos.top * 1.25,
          mousePos.width * 1.25,
          mousePos.height * 1.25,
          0,
          0,
          mousePos.width,
          mousePos.height
        ]
        // can.width = mousePos.width * 1.25
        // can.height = mousePos.height * 1.25
        window.api.sendIpcMain('desktopCapturerWin', {
          ...mousePos,
          width,
          height,
          ctxDrawImageOpt,
          imgUrl
        })
        setShowFlag(true)
      }, 500)
    }
  }

  const desktopCapturerMouseUp = (): void => {
    setMoveFlag(false)
    // setMousePos(obj)
  }
  const sty = React.useMemo(() => {
    const keys = Object.keys(obj)
    const styObj = {}
    for (let i = 0; i < keys.length; i++) {
      styObj[keys[i]] = mousePos[keys[i]] + 'px'
    }
    return styObj
  }, [mousePos])
  React.useEffect(() => {
    window.api.onIcpMainEvent('sendMsg', ipcMainCallBack)
    window.api.onIcpMainEvent('cancelImg', cancelImgCallBack)
  }, [])

  return (
    <div
      className="desktopCapturer nodrag"
      onMouseDown={desktopCapturerMouseDown}
      onMouseMove={desktopCapturerMouseMove}
      onMouseUp={desktopCapturerMouseUp}
      onContextMenu={onContextMenuCancel}
    >
      {/* <canvas id="can"></canvas> */}
      <img className="nodrag" src={imgUrl} ref={img} alt="" srcSet="" />
      {show && <div style={sty} className="nodrag"></div>}
      {showFlag && <div className="mark"></div>}
    </div>
  )
}

export default DesktopCapturer
