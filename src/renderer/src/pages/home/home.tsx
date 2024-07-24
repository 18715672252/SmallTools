import React, { FC } from 'react'
import setting from '../../img/setting.png'
import pin from '../../img/pin.png'
import close from '../../img/close.png'
import shotSel from '../../img/shotSelWhite.png'
import rondom from '../../img/rondom.png'
import './home.css'
import ModalCust from '@renderer/components/modal'
import axios from 'axios'
const Home: FC = (): JSX.Element => {
  const [imgW, setImgW] = React.useState(10)
  const [imgH, setImgH] = React.useState(10)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [loading, setLoding] = React.useState(false)
  const getpp = (): void => {
    // router('/setting')
    window.api.sendIpcMain('desktopCapturer')
  }
  const rondomImg = (): void => {
    setIsModalOpen(true)
  }
  const generateImg = async (): Promise<unknown> => {
    setLoding(true)
    const res = await axios.get(`https://picsum.photos/${imgW}/${imgH}`)
    // return window.api.invoke('download-img', res.request.responseURL)
    await window.api.sendIpcMain('randowImg', res.request.responseURL)
    setLoding(false)
    return 1
  }
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
        <div className="min comApp nodrag"></div>
        <div className="close comApp nodrag">
          <img src={close} width={16} alt="" />
        </div>
      </div>
      <div className="home-contnet">
        <div onClick={getpp} title="截图">
          <img src={shotSel} alt="" />
        </div>
        <div title="随机图片" onClick={rondomImg}>
          <img src={rondom} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Home
