import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from "react-router";
import axios  from 'axios';

axios.defaults.withCredentials = true;
const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedback, setFeedback] = useState({
    rating: '',
    comment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(() => {
    fetchCourses();
    // Load submitted feedbacks from localStorage
  }, []);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState(new Set());
  
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      setCourses(response.data);  // axios automatically parses JSON
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/feedback/course/${selectedCourse._id}`,
        feedback,  // axios automatically stringifies the body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      // Update local storage and state to mark feedback as submitted
      const newSubmittedFeedbacks = new Set(submittedFeedbacks);
      newSubmittedFeedbacks.add(selectedCourse._id);
      localStorage.setItem('submittedFeedbacks', JSON.stringify([...newSubmittedFeedbacks]));
      setSubmittedFeedbacks(newSubmittedFeedbacks);
  
      // Reset and close modal
      setFeedback({ rating: '', comment: '' });
      setIsFeedbackModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const openFeedbackModal = (course) => {
    setSelectedCourse(course);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to='/dashboard'>
            <div className="bg-blue-300 h-[60px] w-[60px] rounded-[100%] rounded-br-none flex items-center justify-center hover:cursor-pointer hover:bg-purple-300">
              <ArrowLeft
                size={30}
                className="hover:rotate-[35deg] transition-all delay-100"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Available Courses</h1>
          <div className="w-[60px]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => {
            const hasFeedback = submittedFeedbacks.has(course._id);
            
            return (
              <div 
                key={course._id} 
                className={`bg-white rounded-lg shadow-md p-6 ${hasFeedback ? 'opacity-60' : ''}`}
              >
                <div>
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  <p className="text-gray-600">Code: {course.courseCode}</p>
                  <p className="text-gray-600">Department: {course.department}</p>
                </div>
                <div className="flex items-center w-full justify-between mt-4">
                  
                  {!hasFeedback && (
                    <button 
                      onClick={() => openFeedbackModal(course)}
                      className="px-3 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600"
                    >
                      Give Feedback
                    </button>
                  )}
                  {hasFeedback && (
                    <span className="text-green-600 font-medium">Feedback Submitted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Modal */}
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                Submit Feedback for {selectedCourse?.name}
              </h2>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                  name="rating"
                  value={feedback.rating}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="5">Excellent (5)</option>
                  <option value="4">Very Good (4)</option>
                  <option value="3">Good (3)</option>
                  <option value="2">Fair (2)</option>
                  <option value="1">Poor (1)</option>
                </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    className="w-full p-2 border rounded-md h-32"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourses;