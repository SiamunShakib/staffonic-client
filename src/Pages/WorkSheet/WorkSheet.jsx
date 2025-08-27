import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash, FaPlus, FaChartLine } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

const WorkSheet = () => {
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState("Sales");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(new Date());
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/workRecords?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setWorks(data));
    }
  }, [user]);

  const sortedWorks = works.sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "hours-desc") return b.hours - a.hours;
    if (sortBy === "hours-asc") return a.hours - b.hours;
    return 0;
  });

  const totalHours = works.reduce((total, work) => total + parseFloat(work.hours), 0);

  const handleAddWork = (e) => {
    e.preventDefault();
    if (!hours || hours <= 0) return Swal.fire("Error", "Valid hours required", "error");

    const newWork = {
      task,
      hours: parseFloat(hours),
      date: date.toISOString().split("T")[0],
      name: user.name,
      email: user.email,
    };

    fetch("http://localhost:5000/workRecords", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newWork),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          setWorks([{ ...newWork, _id: data.insertedId }, ...works]);
          setHours("");
          Swal.fire("Success", "Work added successfully!", "success");
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/workRecords/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              setWorks(works.filter((w) => w._id !== id));
              Swal.fire("Deleted!", "Work record has been removed.", "success");
            }
          });
      }
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingWork) return;

    fetch(`http://localhost:5000/workRecords/${editingWork._id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editingWork),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          setWorks(
            works.map((w) => (w._id === editingWork._id ? editingWork : w))
          );
          setShowModal(false);
          setEditingWork(null);
          Swal.fire("Updated!", "Work updated successfully", "success");
        }
      });
  };

  return (
    <div className="py-10 px-4 md:px-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8" data-aos="fade-down">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Work Sheet</h2>
            <p className="text-gray-600 mt-2">Track your daily activities and working hours</p>
          </div>

          <div className="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-md flex items-center" data-aos="fade-left">
            <div className="mr-4 p-3 bg-indigo-100 rounded-full">
              <FaChartLine className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold text-indigo-700">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        {/* Add Work Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaPlus className="mr-2 text-indigo-600" /> Add New Work
          </h3>

          <form onSubmit={handleAddWork} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option>Sales</option>
                <option>Support</option>
                <option>Content</option>
                <option>Paper-work</option>
                <option>Research</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-4 flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Add Work
              </button>
            </div>
          </form>
        </div>

        {/* Sort */}
        <div className="flex mb-6" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white rounded-xl shadow-sm px-4 py-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="hours-desc">Most Hours</option>
              <option value="hours-asc">Fewest Hours</option>
            </select>
          </div>
        </div>

        {/* Work Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white ">
                <tr>
                  <th className="pl-4 text-left">Task</th>
                  <th className="p-4 text-left">Hours</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedWorks.map((work) => (
                  <tr key={work._id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{work.task}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {work.hours}h
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{work.date}</td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditingWork({ ...work }); setShowModal(true); }}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-100"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(work._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedWorks.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No work records found. Add your first work entry above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && editingWork && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" data-aos="zoom-in">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
                <h3 className="text-xl font-semibold">Edit Work Record</h3>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                  <select
                    value={editingWork.task}
                    onChange={(e) => setEditingWork({ ...editingWork, task: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option>Sales</option>
                    <option>Support</option>
                    <option>Content</option>
                    <option>Paper-work</option>
                    <option>Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={editingWork.hours}
                    onChange={(e) => setEditingWork({ ...editingWork, hours: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <DatePicker
                    selected={new Date(editingWork.date)}
                    onChange={(d) => setEditingWork({ ...editingWork, date: d.toISOString().split("T")[0] })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Update Record
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

export default WorkSheet;
