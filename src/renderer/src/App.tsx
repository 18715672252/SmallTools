import { Routes, Route, HashRouter } from 'react-router-dom'
import React, { useState } from 'react'
import Home from './pages/home/home'
import Setting from './pages/setting/setting'
import DesktopCapturerwin from './pages/desktopCapturerWin/desktopCapturerWin'
import ReactScreenshots from './pages/reactScreenshots/reactScreenshots'
import { getLocalStorage, parseObject } from '../../utils'
import { initStore } from '../../types/type'
import Recording from './pages/recording/recording'
export const Context = React.createContext<initStore>({ recordStatus: 'end' })
function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [store, setStore] = useState<initStore>(() => getLocalStorage('store'))
  React.useEffect(() => {
    window.addEventListener('storage', (e) => {
      setStore({ ...store, ...parseObject(e.newValue as string) })
    })
  }, [])
  return (
    <Context.Provider value={store}>
      <div className="app">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
            <Route path="/desktopCapturer" element={<ReactScreenshots />} />
            <Route path="/desktopCapturerwin" element={<DesktopCapturerwin />} />
            <Route path="/recording" element={<Recording />} />
          </Routes>
        </HashRouter>
      </div>
    </Context.Provider>
  )
}

export default App
