import { FC, useState, useEffect } from 'react'
import pin from '../../img/pin.png'
import close from '../../img/close.png'
import pinSel from '../../img/pinSel.png'
import './desktopCapturerWin.css'
const DesktopCapturerwin: FC = (): JSX.Element => {
  const [bg, setBg] = useState('')
  const [pinFlag, setPinFlag] = useState(false)

  const ipcMainCallBack = (data): void => {
    setBg(data.imgUrl)
  }
  const closeWin = (): void => {
    window.api.sendIpcMain('closeWin')
  }

  const minmaxWin = (): void => {
    window.api.sendIpcMain('minmaxWin')
  }

  const setPin = (): void => {
    window.api.sendIpcMain('pinWin')
    setPinFlag(!pinFlag)
  }
  useEffect(() => {
    window.api.onIcpMainEvent('showDesktopCapturerWin', ipcMainCallBack)
  }, [])
  return (
    <div className="desktopCapturer-win drag">
      <div className="home-header drag">
        <div
          className="pin nodrag"
          onClick={setPin}
          title={!pinFlag ? '已钉在桌面' : '没有钉在桌面'}
        >
          {pinFlag ? <img src={pin} width={16} alt="" /> : <img src={pinSel} width={16} alt="" />}
        </div>
        <div className="br"></div>
        <div className="min comApp nodrag" onClick={minmaxWin}></div>
        <div className="close comApp nodrag" onClick={closeWin}>
          <img src={close} width={16} alt="" />
        </div>
      </div>
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
