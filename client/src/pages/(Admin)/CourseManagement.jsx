import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowLeft, Upload } from 'lucide-react';
import { Link } from "react-router";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

axios.defaults.withCredentials = true;

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedback, setFeedback] = useState({
    rating: '',
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState(new Set());
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    Promise.all([
      fetchCourses(),
      fetchUserSubmittedFeedbacks()
    ]).then(() => setLoading(false));
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUserSubmittedFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/feedback/user/submitted', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSubmittedFeedbacks(new Set(response.data.map(feedback => feedback.courseId)));
    } catch (error) {
      console.error('Error fetching submitted feedbacks:', error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/feedback/course/${selectedCourse._id}`,
        feedback,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSubmittedFeedbacks(prev => new Set([...prev, selectedCourse._id]));
      setFeedback({ rating: '', comment: '' });
      setIsFeedbackModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleFileUpload = async (e, courseId) => {
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const sentimentCounts = {
        positive: 0,
        negative: 0,
        neutral: 0
      };

      data.forEach(row => {
        const prediction = row['AI Prediction'].toLowerCase();
        if (prediction.includes('positive')) {
          sentimentCounts.positive++;
        } else if (prediction.includes('negative')) {
          sentimentCounts.negative++;
        } else {
          sentimentCounts.neutral++;
        }
      });

      setAnalysisResults(sentimentCounts);

      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/courses/${courseId}/sentiment-analysis`,
        {
          sentimentCounts,
          feedbacks: data
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // alert('Analysis completed and saved successfully!');
    } catch (error) {
      console.error('Error processing file:', error);
      // alert('Error processing file');
    }
  };

  const openFeedbackModal = (course) => {
    setSelectedCourse(course);
    setIsFeedbackModalOpen(true);
  };

  const openUploadModal = (course) => {
    setSelectedCourse(course);
    setIsUploadModalOpen(true);
  };

  const handleGenerateReport = async (course) => {
    try {
      console.log(course);

      const token = localStorage.getItem('token');
      // Fetch detailed feedback data for the course
      const response = await axios.get(`http://localhost:3000/api/admin/course/feedback/${course._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Report Generated successfully!', {
        position: 'bottom-right',
        duration: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
          fontSize: '16px',
        }
      });

    } catch (error) {
      console.error('Error generating report:', error);

    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to='/admin/dashboard'>
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
                className={`bg-white rounded-lg shadow-md p-6 transition-opacity duration-300 ${hasFeedback ? 'opacity-60' : 'opacity-100'
                  }`}
              >
                <div>
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  <p className="text-gray-600">Code: {course.courseCode}</p>
                  <p className="text-gray-600">Department: {course.department}</p>
                </div>
                <div className="flex items-center w-full justify-between mt-4">
                  {!hasFeedback ? (
                    <div className="flex gap-2">

                      {
                        course.feedbacks.length > 0 && <div className='flex items-center space-x-4 '>
                          <button
                            onClick={() => handleGenerateReport(course)}

                            className='px-3 py-2 rounded-md bg-green-500 text-white font-semibold'>Generate Report</button>
                        </div>
                      }




                      <button
                        onClick={() => openUploadModal(course)}
                        className="px-3 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Upload Excel
                      </button>
                    </div>
                  ) : (
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
                    name="comment"
                    value={feedback.comment}
                    onChange={handleInputChange}
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

        {/* Excel Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                Upload Feedback Excel for {selectedCourse?.name}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File
                  </label>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, selectedCourse?._id)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                {analysisResults && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Analysis Results:</h3>
                    <p>Positive Comments: {analysisResults.positive}</p>
                    <p>Negative Comments: {analysisResults.negative}</p>
                    <p>Neutral Comments: {analysisResults.neutral}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setAnalysisResults(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourses;