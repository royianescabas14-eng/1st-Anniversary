import { Navigate, Route, Routes } from 'react-router-dom'
import Month12 from './Month12.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/month/12" element={<Month12 />} />
      <Route path="*" element={<Navigate to="/month/12" replace />} />
    </Routes>
  )
}