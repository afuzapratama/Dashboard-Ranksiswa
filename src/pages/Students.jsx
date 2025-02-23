import { useEffect, useState } from 'react';
import api from '../services/api';

function Students() {
  // --------------------------------------------------
  // STATE: STUDENTS
  // --------------------------------------------------
  const [students, setStudents] = useState([]);

  // Form "Add / Edit Student"
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [photo, setPhoto] = useState(null);

  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editStudentId, setEditStudentId] = useState('');

  // --------------------------------------------------
  // STATE: CLASSES
  // --------------------------------------------------
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');

  const [editClassId, setEditClassId] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [isEditingClass, setIsEditingClass] = useState(false);

  // --------------------------------------------------
  // STATE: SEARCH
  // --------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // menampilkan 10 data per halaman

  // --------------------------------------------------
  // FETCH STUDENTS
  // --------------------------------------------------
  const fetchStudents = async () => {
    try {
      // Pastikan backend .populate('classId')
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching students');
    }
  };

  // --------------------------------------------------
  // FETCH CLASSES
  // --------------------------------------------------
  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes');  
      setClasses(res.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching classes');
    }
  };

  // --------------------------------------------------
  // USE EFFECT
  // --------------------------------------------------
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // --------------------------------------------------
  // HANDLE ADD STUDENT
  // --------------------------------------------------
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('classId', classId);
      if (photo) formData.append('photo', photo);

      await api.post('/students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Student added!');

      // reset
      setName('');
      setClassId('');
      setPhoto(null);

      fetchStudents(); // refresh
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding student');
    }
  };

  // --------------------------------------------------
  // HANDLE EDIT STUDENT
  // --------------------------------------------------
  const handleEditStudent = (st) => {
    setEditStudentId(st._id);
    setName(st.name || '');
    setClassId(st.classId?._id || '');
    setPhoto(null);
    setIsEditingStudent(true);
  };

  // --------------------------------------------------
  // HANDLE UPDATE STUDENT
  // --------------------------------------------------
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('classId', classId);
      if (photo) formData.append('photo', photo);

      await api.put(`/students/${editStudentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Student updated!');

      // reset
      setName('');
      setClassId('');
      setPhoto(null);
      setEditStudentId('');
      setIsEditingStudent(false);

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error updating student');
    }
  };

  // --------------------------------------------------
  // HANDLE CANCEL EDIT STUDENT
  // --------------------------------------------------
  const handleCancelEditStudent = () => {
    setIsEditingStudent(false);
    setEditStudentId('');
    setName('');
    setClassId('');
    setPhoto(null);
  };

  // --------------------------------------------------
  // HANDLE DELETE STUDENT
  // --------------------------------------------------
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure want to delete this student?')) return;
    try {
      await api.delete(`/students/${studentId}`);
      alert('Student deleted!');
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error deleting student');
    }
  };

  // --------------------------------------------------
  // HANDLE ADD CLASS
  // --------------------------------------------------
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/classes', { name: className });
      alert('Class added!');
      setClassName('');
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding class');
    }
  };

  // --------------------------------------------------
  // HANDLE EDIT CLASS
  // --------------------------------------------------
  const handleEditClass = (cls) => {
    setEditClassId(cls._id);
    setEditClassName(cls.name);
    setIsEditingClass(true);
  };

  // --------------------------------------------------
  // HANDLE UPDATE CLASS
  // --------------------------------------------------
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/classes/${editClassId}`, { name: editClassName });
      alert('Class updated!');

      // reset
      setEditClassId('');
      setEditClassName('');
      setIsEditingClass(false);

      fetchClasses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error updating class');
    }
  };

  // --------------------------------------------------
  // HANDLE DELETE CLASS
  // --------------------------------------------------
  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure want to delete this class?')) return;
    try {
      await api.delete(`/classes/${classId}`);
      alert('Class deleted!');
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error deleting class');
    }
  };

  // --------------------------------------------------
  // SEARCH / FILTER Students
  // --------------------------------------------------
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredStudents = students.filter((st) => {
    const studentName = st.name.toLowerCase();
    const cName = st.classId?.name?.toLowerCase() || '';
    return (
      studentName.includes(lowerSearchTerm) ||
      cName.includes(lowerSearchTerm)
    );
  });

  // --------------------------------------------------
  // PAGINATION (client side)
  // --------------------------------------------------
  const totalFiltered = filteredStudents.length; 
  const totalPages = Math.ceil(totalFiltered / pageSize);

  // pastikan currentPage tidak melebihi totalPages
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage || 1;

  // slice data
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const goToPage = (pageNum) => {
    // pageNum between 1..totalPages
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    setCurrentPage(pageNum);
  };

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Students & Classes</h2>

      <div className="flex space-x-4 mb-8">
        {/* ------------------------------------------ */}
        {/* Bagian: Add / Edit Student */}
        {/* ------------------------------------------ */}
        <div className="bg-white p-4 shadow rounded w-1/2">
          {isEditingStudent ? (
            <>
              <h3 className="font-semibold mb-2 text-lg">Edit Student</h3>
              <form onSubmit={handleUpdateStudent}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    className="border w-full px-3 py-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Class</label>
                  <select
                    className="border w-full px-3 py-2 rounded"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">New Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditStudent}
                  className="bg-gray-300 ml-2 px-4 py-2 rounded mt-2"
                >
                  Cancel
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-2 text-lg">Add New Student</h3>
              <form onSubmit={handleAddStudent}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    className="border w-full px-3 py-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Class</label>
                  <select
                    className="border w-full px-3 py-2 rounded"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                >
                  Submit
                </button>
              </form>
            </>
          )}
        </div>

        {/* ------------------------------------------ */}
        {/* Bagian: Add / Update Class + Table Class */}
        {/* ------------------------------------------ */}
        <div className="bg-white p-4 shadow rounded w-1/2">
          {isEditingClass ? (
            <>
              <h3 className="font-semibold mb-2 text-lg">Edit Class</h3>
              <form onSubmit={handleUpdateClass}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Class Name</label>
                  <input 
                    type="text"
                    className="border w-full px-3 py-2 rounded"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                >
                  Update
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditingClass(false);
                    setEditClassName('');
                    setEditClassId('');
                  }}
                  className="bg-gray-300 ml-2 px-4 py-2 rounded mt-2"
                >
                  Cancel
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-2 text-lg">Add New Class</h3>
              <form onSubmit={handleAddClass}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Class Name</label>
                  <input 
                    type="text"
                    className="border w-full px-3 py-2 rounded"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                >
                  Submit
                </button>
              </form>
            </>
          )}

          <table className="min-w-full bg-white shadow rounded mt-3">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs">Class Name</th>
                <th className="px-4 py-2 text-left text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-b text-xs">
                  <td className="px-4 py-2">{cls.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs" 
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- SEARCH BAR ------------------- */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Search Student / Class</label>
        <input
          type="text"
          className="border px-3 py-2 rounded w-1/2"
          placeholder="Type to search by student name or class name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ------------------- TABLE STUDENTS ------------------- */}
      <h3 className="text-xl font-bold mb-2">Students List</h3>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Class</th>
            <th className="px-4 py-2 text-left">Photo</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((st) => (
            <tr key={st._id} className="border-b">
              <td className="px-4 py-2">{st.name}</td>
              <td className="px-4 py-2">
                {st.classId ? st.classId.name : 'No class'}
              </td>
              <td className="px-4 py-2">
                {st.photoUrl ? (
                  <img
                    src={st.photoUrl}
                    alt={st.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : 'No photo'}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditStudent(st)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStudent(st._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ------------------- PAGINATION CONTROL ------------------- */}
      <div className="flex items-center justify-between mt-3">
        <p>
          Showing page {safeCurrentPage} of {totalPages} (total {totalFiltered} students)
        </p>
        <div className="space-x-2">
          <button
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Students;
