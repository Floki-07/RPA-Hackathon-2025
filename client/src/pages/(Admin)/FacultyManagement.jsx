import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from "react-router";
const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newFaculty, setNewFaculty] = useState({
        name: '',
        department: '',
    });

    useEffect(() => {
        fetchFaculties();
        // setFaculties([{ name: 'Dr. John Doe', department: 'Computer Science'}])
    }, []);

    const fetchFaculties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/admin/allfaculties', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFaculties(response.data.faculties);
        } catch (error) {
            alert('Error fetching faculties');
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/addfaculty', newFaculty, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddModalOpen(false);
            setNewFaculty({ name: '', department: '' });
            fetchFaculties();
        } catch (error) {
            alert('Error adding faculty');
        }
    };

    const handleDeleteFaculty = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/admin/deletefaculty/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchFaculties();
            } catch (error) {
                alert('Error deleting faculty');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 w-full" >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link to='/admin/dashboard'>

                        <div className="bg-blue-300 h-[60px] w-[60px] rounded-[100%] rounded-br-none flex items-center justify-center hover:cursor-pointer hover:bg-purple-[--ternary]">
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
                            <div className="flex items-center w-full justify-between mt-4">
                                <div className="flex items-center text-gray-600">
                                    <MessageCircle size={20} className="mr-2" />
                                    <span>{faculty.feedbackCount || 0} Feedbacks</span>
                                </div>

                                <div className='flex items-center space-x-4 '>
                                    <button className='px-3 py-2 rounded-md bg-green-500 text-white font-semibold'>Generate Report</button>
                                </div>
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
            </div>
        </div>
    );
};

export default FacultyManagement;