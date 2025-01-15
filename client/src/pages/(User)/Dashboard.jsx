import React, { useEffect, useState } from 'react';
import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
 
  const fetchUser = async () => {
    let token = localStorage.getItem('token');
    try {
      let resposne = await axios.get('http://localhost:3000/api/getuser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(resposne.data.user);
      setUser(resposne.data.user);  

    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Error fetching user');

    }
  }



  useEffect(() => {
    fetchUser()
  }, []);


  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100 p-6 w-full' >
      {/* Header */}
      <div className='mb-8 text-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Student Feedback Portal</h1>
          <p className='text-gray-600'>
            Hello
            <span className='font-semibold text-black text-[17px]'> {user?.name}</span>, please

            select the type of feedback you'd like to provide</p>
        </div>
      </div>

      {/* Cards Container */}
      <div className='flex flex-wrap gap-6 justify-center max-w-4xl'>
        {/* Course Feedback Card */}
        <div className='bg-white rounded-xl shadow-lg p-6 w-80 hover:shadow-xl transition-shadow'>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 p-4 bg-blue-50 rounded-full'>
              <BookOpen size={48} className='text-blue-500' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Course Feedback</h2>
            <p className='text-gray-600 mb-6'>Share your thoughts about your courses and learning experience</p>
            <button
              onClick={() => navigate('/course-feedback')}
              className='flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              Get Started
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Faculty Feedback Card */}
        <div className='bg-white rounded-xl shadow-lg p-6 w-80 hover:shadow-xl transition-shadow'>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 p-4 bg-purple-50 rounded-full'>
              <Users size={48} className='text-purple-500' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Faculty Feedback</h2>
            <p className='text-gray-600 mb-6'>Evaluate your professors and teaching assistants</p>
            <button
              onClick={() => navigate('/faculty-feedback')}
              className='flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              Get Started
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className='mt-12 text-center'>
        <p className='text-sm text-gray-500'>
          Your feedback helps us improve the academic experience
        </p>
      </div>
    </div>
  );
};

export default Dashboard;