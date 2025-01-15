import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const FacultyFeedback = () => {
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    rating: '',
    teachingQuality: '',
    communication: '',
    helpfulness: '',
    comments: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faculties');
      setFaculties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
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
        `http://localhost:5000/api/feedback/faculty/${selectedFaculty._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert('Feedback submitted successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  // Dummy faculty data (replace with your API data)
  const dummyFaculties = [
    { _id: 1, name: 'Dr. Bruce Banner', department: 'Computer Science', image: '/api/placeholder/100/100' },
    { _id: 2, name: 'Dr. Emily Brown', department: 'Physics', image: '/api/placeholder/100/100' },
    { _id: 3, name: 'Prof. Michael Chen', department: 'Mathematics', image: '/api/placeholder/100/100' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Faculty Feedback</h1>
      
      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {(faculties.length ? faculties : dummyFaculties).map((faculty) => (
          <div 
            key={faculty._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleOpenModal(faculty)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={`/Professors/${faculty._id}.png`}
                alt={faculty.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{faculty.name}</h3>
                <p className="text-gray-600">{faculty.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
        <img src="/Professors/1" alt="" srcset="" />
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
              {/* Overall Rating */}
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

           

              {/* Comments */}
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