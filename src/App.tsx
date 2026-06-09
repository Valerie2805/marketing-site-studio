import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'
import Site from '@/pages/Site'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/site" element={<Site />} />
        <Route path="/site/:page" element={<Site />} />
      </Routes>
    </Router>
  )
}
