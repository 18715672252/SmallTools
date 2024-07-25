import React, { FC } from 'react'
import setting from '../../img/setting.png'
import pin from '../../img/pin.png'
import close from '../../img/close.png'
import shotSel from '../../img/shotSelWhite.png'
import rondom from '../../img/rondom.png'
import rondomoffline from '../../img/rondomoffline.png'
import screenrecording from '../../img/screenrecording.png'
import encode from '../../img/encode.png'
import { winAction } from '../../../../types/type'
import './home.css'
import ModalCust from '@renderer/components/modal'
import axios from 'axios'
const Home: FC = (): JSX.Element => {
  const [imgW, setImgW] = React.useState(10)
  const [imgH, setImgH] = React.useState(10)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [loading, setLoding] = React.useState(false)
  const [netStatus, setNetStatus] = React.useState(true)
  const getpp = (): void => {
    // router('/setting')
    window.api.sendIpcMain('desktopCapturer')
  }
  const rondomImg = (): void => {
    if (!netStatus) return
    setIsModalOpen(true)
  }
  const generateImg = async (): Promise<unknown> => {
    setLoding(true)
    const res = await axios.get(`https://picsum.photos/${imgW}/${imgH}`)
    // return window.api.invoke('download-img', res.request.responseURL)
    await window.api.sendIpcMain('randowImg', res.request.responseURL)
    setLoding(false)
    return true
  }
  const winAction = (type: winAction): void | boolean => {
    if (type === 'closeWin') {
      window.api.sendIpcMain('closeWin')
      return false
    }
    if (type === 'minmax') {
      window.api.sendIpcMain('minmaxWin')
      return false
    }
  }
  React.useEffect(() => {
    window.addEventListener('online', function () {
      setNetStatus(true)
    })

    window.addEventListener('offline', function () {
      setNetStatus(false)
    })
  }, [])
  return (
    <div className="home">
      <ModalCust
        isModalOpen={isModalOpen}
        hModal={{ value: imgH, onChange: (val) => setImgH(val as number) }}
        wModal={{ value: imgW, onChange: (val) => setImgW(val as number) }}
        generateImg={generateImg}
        loading={loading}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="home-header drag">
        <img className="setting nodrag " src={setting} width={16} alt="" />
        <img className="pin nodrag" src={pin} width={16} alt="" />
        <div className="br"></div>
        <div className="min comApp nodrag" onClick={() => winAction('minmax')}></div>
        <div className="close comApp nodrag" onClick={() => winAction('closeWin')}>
          <img src={close} width={16} alt="" />
        </div>
      </div>
      <div className="home-contnet">
        <div onClick={getpp} title="截图">
          <img src={shotSel} alt="" />
        </div>
        <div title={netStatus ? '随机图片' : '网络已断开'} onClick={rondomImg}>
          {netStatus ? <img src={rondom} alt="" /> : <img src={rondomoffline} alt="" />}
        </div>
        <div title="屏幕录制" onClick={rondomImg}>
          <img src={screenrecording} alt="" />
        </div>
        <div title="视频转码" onClick={rondomImg}>
          <img src={encode} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Home
