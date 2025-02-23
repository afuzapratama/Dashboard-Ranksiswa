import { useEffect, useState } from 'react';
import Select from 'react-select';
import api from '../services/api';

function Subjects() {
  // Data subject dari GET /api/subjects
  const [subjects, setSubjects] = useState([]);
  
  // State untuk form "Add Subject"
  const [subjectName, setSubjectName] = useState('');

  // State untuk form "Add Category"
  const [catSubjectId, setCatSubjectId] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // State untuk class

  // State untuk form "Add Score"
  const [scoreSubjectId, setScoreSubjectId] = useState('');
  const [scoreStudentId, setScoreStudentId] = useState('');
  const [scoreCategory, setScoreCategory] = useState('');
  const [scoreValue, setScoreValue] = useState('');

  // Untuk menampung list student (kita ambil dari /api/students)
  const [students, setStudents] = useState([]);

  // Setelah user memilih subject di "Add Score", kita akan menampilkan categories subject itu
  const [availableCategories, setAvailableCategories] = useState([]);

  // --------------------------------------------------
  // 1. FETCH SUBJECTS (GET /api/subjects)
  // --------------------------------------------------
  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects'); 
      // res.data: array of subject { _id, name, scoreCategories, scores }
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching subjects');
    }
  };

  // --------------------------------------------------
  // 2. FETCH STUDENTS
  // --------------------------------------------------
  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);

    } catch (err) {
      console.error(err);
      alert('Error fetching students');
    }
  };

  // --------------------------------------------------
  // USEEFFECT -> panggil fetchSubjects & fetchStudents
  // --------------------------------------------------
  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, []);


  // --------------------------------------------------
  // 3. HANDLER "ADD SUBJECT" (POST /api/subjects)
  // --------------------------------------------------
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', { name: subjectName });
      alert('Subject created!');
      setSubjectName('');
      fetchSubjects(); // refresh
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding subject');
    }
  };

  // --------------------------------------------------
  // 4. HANDLER "ADD CATEGORY" (POST /api/subjects/:subjectId/category)
  // --------------------------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catSubjectId) {
      alert('Select a subject first!');
      return;
    }
    try {
      await api.post(`/subjects/${catSubjectId}/category`, {
        category: newCategory
      });
      alert('Category added!');
      setNewCategory('');
      fetchSubjects(); // refresh
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  // --------------------------------------------------
  // 5. HANDLER "ADD SCORE" (POST /api/subjects/:subjectId/score)
  // --------------------------------------------------
  //  * Pertama user pilih subject -> kita set subjectId -> kita tampilkan categories subject tsb.
  const onChangeScoreSubject = (subId) => {
    setScoreSubjectId(subId);
    const found = subjects.find((s) => s._id === subId);
    if (found) {
      // s.scoreCategories
      setAvailableCategories(found.scoreCategories || []);
    } else {
      setAvailableCategories([]);
    }
  };


  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!scoreSubjectId) {
      alert('Select subject first!');
      return;
    }
    if (!scoreStudentId) {
      alert('Select student first!');
      return;
    }
    if (!scoreCategory) {
      alert('Select category first!');
      return;
    }
    if (!scoreValue) {
      alert('Enter the score!');
      return;
    }
    try {
      const payload = {
        studentId: scoreStudentId,
        category: scoreCategory,
        score: Number(scoreValue)
      };
      await api.post(`/subjects/${scoreSubjectId}/score`, payload);
      alert('Score added/updated!');
      // reset form
      setScoreSubjectId('');
      setScoreStudentId('');
      setScoreCategory('');
      setScoreValue('');
      setAvailableCategories([]);
      fetchSubjects(); // refresh data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding/updating score');
    }
  };

  const studentOptions = students.map(st => ({
    value: st._id,
    label: `${st.name} (${st.classId.name})`, // Menampilkan nama kelas jika sudah tersedia
  }));

  // --------------------------------------------------
  // 6. RENDER
  // --------------------------------------------------
  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4">Subjects Management</h2>
  
      {/* Form Container */}
      <div className="flex flex-wrap gap-4">
        {/* Form Add Subject */}
        <form onSubmit={handleAddSubject} className="bg-white p-4 shadow rounded flex-1 min-w-[300px]">
          <h3 className="font-semibold mb-2">Add New Subject</h3>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Subject Name</label>
            <input 
              type="text"
              className="border px-3 py-2 w-full rounded"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Matematika"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">
            Add Subject
          </button>
        </form>
  
        {/* Form Add Category */}
        <form onSubmit={handleAddCategory} className="bg-white p-4 shadow rounded flex-1 min-w-[300px]">
          <h3 className="font-semibold mb-2">Add Category to Subject</h3>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Select Subject</label>
            <select className="border w-full px-3 py-2 rounded" value={catSubjectId} onChange={(e) => setCatSubjectId(e.target.value)}>
              <option value="">-- Choose Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Category (e.g. c1)</label>
            <input 
              type="text"
              className="border px-3 py-2 w-full rounded"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">
            Add Category
          </button>
        </form>
  
        {/* Form Add Score */}
        <form onSubmit={handleAddScore} className="bg-white p-4 shadow rounded flex-1 min-w-[300px]">
          <h3 className="font-semibold mb-2">Add/Update Score</h3>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Select Subject</label>
            <select className="border w-full px-3 py-2 rounded" value={scoreSubjectId} onChange={(e) => onChangeScoreSubject(e.target.value)}>
              <option value="">-- Choose Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Select Student</label>
            <Select 
                options={studentOptions}
                value={studentOptions.find(opt => opt.value === scoreStudentId)}
                onChange={selected => setScoreStudentId(selected ? selected.value : '')}
                isSearchable
                className="border w-full px-3 py-2 rounded"
            />
            </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Select Category</label>
            <select className="border w-full px-3 py-2 rounded" value={scoreCategory} onChange={(e) => setScoreCategory(e.target.value)}>
              <option value="">-- Choose Category --</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Score (max 100)</label>
            <input 
              type="number"
              max="100"
              className="border px-3 py-2 w-full rounded"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">
            Add/Update Score
          </button>
        </form>
      </div>
  
      {/* ---------------------------------------------------------------------- */}
      {/* TABEL SUBJECT + SCORES (pivot style) */}
      {subjects.map((subject) => {
        const { _id: subjectId, name, scoreCategories, scores } = subject;
        const categories = scoreCategories || [];
  
        return (
          <div key={subjectId} className="bg-white p-4 shadow rounded mb-6 mt-4">
            <h3 className="text-lg font-semibold mb-2">Subject: {name}</h3>
            <p className="text-sm mb-2">
              Categories: {categories.length > 0 ? categories.join(', ') : '-'}
            </p>
  
            <table className="min-w-full bg-gray-50">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-200">Student</th>
                  {categories.map((cat) => (
                    <th key={cat} className="px-4 py-2 text-left bg-gray-200">{cat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scores && scores.length > 0 ? (
                  scores.map((sc) => {
                    const studentName = sc.studentId?.name || sc.studentId;
                    return (
                      <tr key={sc.studentId?._id || sc.studentId} className="border-b">
                        <td className="px-4 py-2 bg-white">{studentName}</td>
                        {categories.map((cat) => {
                          const val = sc.values ? sc.values[cat] : undefined;
                          return (
                            <td key={cat} className="px-4 py-2 bg-white">
                              {val !== undefined ? val : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={1 + categories.length} className="text-center p-4">
                      No scores yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default Subjects;
