import React from 'react';
import { BookOpen, Users, ChevronRight, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100 p-6 w-full'>
      {/* Admin Login Indicator */}
      <div className='w-full flex justify-end p-4'>
        <div className='flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-lg'>
          <UserCheck size={20} />
          <span className='text-sm font-semibold'>Admin Logged In</span>
        </div>
      </div>

      {/* Header */}
      <div className='mb-8 text-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Feedback Dashboard</h1>
          <p className='text-gray-600'>
            Hello
            <span className='font-semibold text-black text-[17px]'> Admin</span>, please select the feedback you'd like to review
          </p>
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
            <p className='text-gray-600 mb-6'>Review the feedback submitted for courses and learning experiences</p>
            <button 
              onClick={() => navigate('/admin/course-feedback')}
              className='flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              <Link to="/admin/course-feedback">Review Feedback</Link>
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
            <p className='text-gray-600 mb-6'>Analyze feedback for professors and teaching assistants</p>
            <button 
              onClick={() => navigate('/admin/faculty-feedback')}
              className='flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              Review Feedback
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className='mt-12 text-center'>
        <p className='text-sm text-gray-500'>
          Reviewing feedback helps enhance the academic experience
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
