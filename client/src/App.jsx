import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes, BrowserRouter as Router } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import Dashboard from './pages/(User)/Dashboard'
import { useNavigate } from 'react-router-dom';
import CourseFeedback from './pages/(User)/CourseFeedback'
import FacultyFeedback from './pages/(User)/FacultyFeedback'
import AdminDashboard from './pages/(Admin)/Dashboard'  
import AdminFaculty from './pages/(Admin)/Faculty'  



function AppLayout() {
  return (
    <div className='bg-[--background  ] h-screen text-[--primary]'>
    <div className='flex h-[calc(100%-60px)] custom-scrollbar'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course-feedback" element={<CourseFeedback />} />
        <Route path="/faculty-feedback" element={<FacultyFeedback />} />



        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/faculty" element={<AdminFaculty/>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  </div>
  )
};

function App() {
  return (
    
      <Router>
        <AppLayout />
      </Router>
  
  );
}
export default App
