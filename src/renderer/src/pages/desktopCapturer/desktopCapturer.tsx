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
  const img: unknown = React.useRef(null)
  const ipcMainCallBack = (data: imgOptType): void => {
    setImgUrl(data.imgUrl)
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
  }

  const desktopCapturerMouseMove = (e: React.MouseEvent): void => {
    if (moveFlag) {
      if (!show) setShow(true)

      setMousePos(obj)
      const { pageX, pageY } = e
      console.log(pageX - mousePos.left, pageY - mousePos.top)
      const width = pageX - mousePos.left
      const height = pageY - mousePos.top
      setMousePos({
        ...mousePos,
        width,
        height
      })
      clearTimeout(timer as NodeJS.Timeout)
      timer = setTimeout(() => {
        const can = document.createElement('canvas')
        const ctx = can.getContext('2d')
        console.log(img.current)
        can.width = mousePos.width
        can.height = mousePos.height
        ctx?.drawImage(
          (img as { current: HTMLImageElement }).current,
          mousePos.left,
          mousePos.top,
          mousePos.width,
          mousePos.height,
          0,
          0,
          mousePos.width,
          mousePos.height
        )
        can.toBlob(() => {

        })
        document.body.appendChild(can)
        window.api.sendIpcMain('desktopCapturerWin', {
          ...mousePos,
          width,
          height
        })
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
  }, [])

  return (
    <div
      className="desktopCapturer nodrag"
      onMouseDown={desktopCapturerMouseDown}
      onMouseMove={desktopCapturerMouseMove}
      onMouseUp={desktopCapturerMouseUp}
    >
      {/* <canvas id="can"></canvas> */}
      <img className="nodrag" src={imgUrl} ref={img} alt="" srcSet="" />
      {show && <div style={sty} className="nodrag"></div>}
    </div>
  )
}

export default DesktopCapturer
