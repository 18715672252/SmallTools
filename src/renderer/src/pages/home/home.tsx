import { FC } from 'react'
import setting from '../../img/setting.png'
import pin from '../../img/pin.png'
import close from '../../img/close.png'
import './home.css'
const Home: FC = (): JSX.Element => {
  const getpp = (): void => {
    // router('/setting')
    window.api.sendIpcMain('desktopCapturer')
  }
  return (
    <div className="home">
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
        <button onClick={getpp}>获取屏幕截图</button>
      </div>
    </div>
  )
}

export default Home
