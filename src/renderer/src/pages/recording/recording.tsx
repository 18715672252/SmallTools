import React, { FC } from 'react'
import record from '../../img/recording.png'
import { secondsToHms } from '../../../../utils/index'
import './recording.css'
const Recording: FC = (): JSX.Element => {
  const [sec, setSec] = React.useState(0)
  const recordimg = React.useMemo(() => {
    return sec % 2 === 0 ? 'record-bg' : 'recoring-bg'
  }, [sec])

  React.useEffect(() => {
    setInterval(() => {
      setSec((preSec) => preSec + 1)
    }, 1000)
  }, [])
  return (
    <div className={recordimg}>
      <div className="record">
        <img src={record} alt="" />
        <div className="text">
          <span style={{ color: 'red' }}>{secondsToHms(sec)}</span>
        </div>
      </div>
    </div>
  )
}

export default Recording
