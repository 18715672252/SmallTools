import React, { FC } from 'react'

const Setting: FC = (): JSX.Element => {
  const [imgUrl, setImgUrl] = React.useState('100')
  const ipcMainCallBack = (data: unknown): void => {
    console.log(data)
    setImgUrl(data as string)
  }
  React.useEffect(() => {
    window.api.onIcpMainEvent('sendMsg', ipcMainCallBack)
  }, [])
  return <div>
    <canvas ></canvas>
  </div>
}

export default Setting
