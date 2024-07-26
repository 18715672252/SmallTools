import React, { FC } from 'react'
import { Context } from '../../App'
import record from '../../img/recording.png'
import { secondsToHms, setLocalStorage } from '../../../../utils/index'
import './recording.css'
const Recording: FC = (): JSX.Element => {
  const [sec, setSec] = React.useState(0)
  const store = React.useContext(Context)
  const saveRecord = (): void => {
    setLocalStorage('store', { recordStatus: 'end' })
    window.api.sendIpcMain('closeWin')
  }
  React.useEffect(() => {
    document.body.onmouseenter = (): void => {
      window.api.sendIpcMain('recordWinMouseenter')
    }
    document.body.onmouseleave = (): void => {
      window.api.sendIpcMain('recordWinMouseLeave')
    }
    setInterval(() => {
      setSec((preSec) => preSec + 1)
    }, 1000)
    
  }, [])
  return (
    <div className="record">
      <img src={record} onClick={saveRecord} alt="" />
      <div className="text">
        <span style={{ fontSize: '12px' }}>{store.recordStatus === 'progress' && '录制中'}</span>
        &nbsp;&nbsp;&nbsp;
        <span style={{ color: 'red' }}>{secondsToHms(sec)}</span>
      </div>
    </div>
  )
}

export default Recording
