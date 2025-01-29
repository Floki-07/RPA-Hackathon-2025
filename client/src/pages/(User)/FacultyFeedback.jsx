import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, ArrowLeft, X } from 'lucide-react';
import { Link } from "react-router";
import { toast } from 'sonner';

const FacultyFeedback = () => {
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    rating: '',
    comments: ''
  });
  const [loading, setLoading] = useState(true);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState(new Set());
  useEffect(() => {
    Promise.all([
      fetchFaculties(),
      fetchUserSubmittedFeedbacks()
    ]).then(() => setLoading(false));
  }, []);

  // Fetch all faculties
  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/faculties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      toast.error('Error loading faculties');
    }
  };

  // Fetch user's submitted feedbacks
  const fetchUserSubmittedFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/feedback/user/submitted', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      
            // Assuming the API returns an array of faculty IDs for which the user has submitted feedback
      setSubmittedFeedbacks(new Set(response.data.map(feedback => feedback.facultyId)));
    } catch (error) {
      console.error('Error fetching submitted feedbacks:', error);
    }
  };

  const handleOpenModal = (faculty) => {
    if (!submittedFeedbacks.has(faculty._id)) {
      setSelectedFaculty(faculty);
      setIsModalOpen(true);
    } else {
      toast.warning('You have already submitted feedback for this faculty', {
        position: 'bottom-right',
        duration: 3000,
        style: {
          backgroundColor: 'orange',
          color: 'white',
          fontSize: '16px',
        }
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
    setFormData({
      rating: '',
      comments: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/feedback/faculty/${selectedFaculty._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the local state with the new submission
      setSubmittedFeedbacks(prev => new Set([...prev, selectedFaculty._id]));

      toast.success('Feedback submitted successfully!', {
        position: 'bottom-right',
        duration: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
          fontSize: '16px',
        }
      });
      
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Check if the error is due to already submitted feedback
      if (error.response?.status === 400) {
        toast.error('You have already submitted feedback for this faculty', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '16px',
          }
        });
      } else {
        toast.error('Error submitting feedback', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '16px',
          }
        });
      }
      handleCloseModal();
    }
  };

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      {/* Rest of the JSX remains the same */}
      <div className="flex bg--500 w-[58%] items-center justify-between mb-8">
        <Link to='/dashboard'>
          <div className="bg-blue-300 h-[60px] w-[60px] rounded-[100%] rounded-br-none flex items-center justify-center hover:cursor-pointer hover:bg-purple-300">
            <ArrowLeft
              size={30}
              className="hover:rotate-[35deg] transition-all delay-100"
            />
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-center">Faculty Feedback</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {faculties.map((faculty) => {
          const hasFeedback = submittedFeedbacks.has(faculty._id);
          
          return (
            <div
              key={faculty._id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all 
                ${hasFeedback ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => handleOpenModal(faculty)}

            >
              <div className="flex items-center space-x-4">
                <img
                  src="/Professors/Facultyplaceholder.png"
                  alt={faculty.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{faculty.name}</h3>
                  <p className="text-gray-600">{faculty.department}</p>
                  {hasFeedback && (
                    <span className="text-green-600 text-sm font-medium">
                      Feedback Submitted ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Feedback for {selectedFaculty?.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating}
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
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-32 resize-none"
                  placeholder="Share your experience with this faculty member..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyFeedback;