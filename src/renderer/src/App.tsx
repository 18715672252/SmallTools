import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/home/home'
import Setting from './pages/setting/setting'
import DesktopCapturer from './pages/desktopCapturer/desktopCapturer'
import DesktopCapturerwin from './pages/desktopCapturerWin/desktopCapturerWin'
function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="app">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/setting" element={<Setting />}></Route>
          <Route path="/desktopCapturer" element={<DesktopCapturer />} />
          <Route path="/desktopCapturerwin" element={<DesktopCapturerwin />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
