import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MessageCircle, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newFaculty, setNewFaculty] = useState({
        name: '',
        department: '',
    });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedfaculty, setSelectedFaculty] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/admin/allfaculties', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFaculties(response.data.faculties);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/api/admin/addfaculty',
                newFaculty,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setIsAddModalOpen(false);
            setNewFaculty({ name: '', department: '' });
            fetchFaculties();
        } catch (error) {
            console.error('Error adding faculty:', error);
        }
    };

    const handleDeleteFaculty = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/admin/deletefaculty/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchFaculties();
            } catch (error) {
                console.error('Error deleting faculty:', error);
            }
        }
    };

    const handleGenerateReport = async (faculty) => {
        try {
            const token = localStorage.getItem('token');
            await axios.get(`http://localhost:3000/api/admin/faculty/feedback/${faculty._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Report generated successfully!', {
                position: 'bottom-right',
                duration: 3000,
                style: {
                    backgroundColor: 'green',
                    color: 'white',
                    fontSize: '16px',
                },
            });
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleFileUpload = async (e, facultyId) => {
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
                neutral: 0,
            };

            data.forEach((row) => {
                const prediction = row['AI Prediction']?.toLowerCase();
                if (prediction?.includes('positive')) {
                    sentimentCounts.positive++;
                } else if (prediction?.includes('negative')) {
                    sentimentCounts.negative++;
                } else {
                    sentimentCounts.neutral++;
                }
            });

            setAnalysisResults(sentimentCounts);

            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3000/api/courses/${facultyId}/sentiment-analysis`,
                {
                    sentimentCounts,
                    feedbacks: data,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error('Error processing file:', error);
        }
    };

    const openUploadModal = (faculty) => {
        setSelectedFaculty(faculty);
        setIsUploadModalOpen(true);
    };



    return (
        <div className="min-h-screen bg-gray-100 p-8 w-full" >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link to='/admin/dashboard'>

                        <div className="bg-purple-500 h-[60px] w-[60px] rounded-[100%] rounded-br-none flex items-center justify-center hover:cursor-pointer hover:bg-purple-[--ternary]">
                            <ArrowLeft
                                size={30}
                                className="hover:rotate-[35deg] transition-all delay-100"
                            />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Faculty Management</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        <Plus size={20} />
                        Add Faculty
                    </button>
                </div>

                {/* Faculty List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculties?.map((faculty) => (
                        <div key={faculty._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">

                                    <div>
                                        <h3 className="font-semibold text-lg">{faculty.name}</h3>
                                        <p className="text-gray-600">{faculty.department}</p>
                                        <p className="text-gray-500 text-sm">{faculty.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteFaculty(faculty._id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="flex items-center w-full justify-between mt-4 gap-2">
                                <div className="flex items-center text-gray-600">
                                    <MessageCircle size={20} className="mr-2" />
                                    <span>{faculty.feedbacks.length || 0}
                                        {faculty.feedbacks.length === 1 ? ' Feedback ' : ' Feedbacks'}
                                    </span>
                                </div>

                                {
                                    faculty.feedbacks.length > 0 && <div className='flex items-center space-x-4 '>
                                        <button
                                            onClick={() => handleGenerateReport(faculty)}

                                            className='px-3 py-2 rounded-md bg-green-500 text-white font-semibold'>Generate Report</button>
                                    </div>
                                }
                                <button
                                    onClick={() => openUploadModal(faculty)}
                                    className="px-3 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    Upload Excel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Faculty Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
                            <form onSubmit={handleAddFaculty} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newFaculty.name}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={newFaculty.department}
                                        onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Add Faculty
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Upload Feedback Excel for {selectedfaculty?.name}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Excel File
                                    </label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={(e) => handleFileUpload(e, selectedfaculty?._id)}
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

export default FacultyManagement;