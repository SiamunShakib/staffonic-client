import React, { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";

const WorkSheet = () => {
  const { user } = use(AuthContext); // logged in user
  const [task, setTask] = useState("Sales");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(new Date());
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null); // modal data
  const [showModal, setShowModal] = useState(false);

  // fetch user-specific data from backend
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/workRecords?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setWorks(data));
    }
  }, [user]);

  // Add work
  const handleAddWork = (e) => {
    e.preventDefault();
    if (!hours) return Swal.fire("Error", "Hours required", "error");

    const newWork = {
      task,
      hours,
      date: date.toISOString().split("T")[0],
      email: user.email,
      paid: false,
    };

    // save to DB
    fetch("http://localhost:5000/workRecords", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newWork),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          setWorks([newWork, ...works]); // add to table top
          setHours("");
          Swal.fire("Success", "Work added!", "success");
        }
      });
  };

  // Delete work
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/workRecords/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          setWorks(works.filter((w) => w._id !== id));
          Swal.fire("Deleted!", "Work removed", "success");
        }
      });
  };

  // Update work
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/workRecords/${editingWork._id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editingWork),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          setWorks(
            works.map((w) => (w._id.toString() === editingWork._id.toString() ? editingWork : w))
          );
          setShowModal(false);
          Swal.fire("Updated!", "Work updated successfully", "success");
        }
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Work Sheet</h2>

      {/* Form Row */}
      <form
        onSubmit={handleAddWork}
        className="flex items-center gap-3 mb-6 bg-gray-100 p-4 rounded-lg"
      >
        <select
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Sales</option>
          <option>Support</option>
          <option>Content</option>
          <option>Paper-work</option>
          <option>Research</option>
        </select>

        <input
          type="number"
          placeholder="Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="border p-2 rounded w-32"
        />

        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Task</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work._id} className="border-t">
              <td className="p-2">{work.task}</td>
              <td className="p-2">{work.hours}</td>
              <td className="p-2">{work.date}</td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => {
                    setEditingWork(work);
                    setShowModal(true);
                  }}
                  className="text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(work._id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Work</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <select
                value={editingWork.task}
                onChange={(e) =>
                  setEditingWork({ ...editingWork, task: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option>Sales</option>
                <option>Support</option>
                <option>Content</option>
                <option>Paper-work</option>
                <option>Research</option>
              </select>

              <input
                type="number"
                value={editingWork.hours}
                onChange={(e) =>
                  setEditingWork({ ...editingWork, hours: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <DatePicker
                selected={new Date(editingWork.date)}
                onChange={(d) =>
                  setEditingWork({
                    ...editingWork,
                    date: d.toISOString().split("T")[0],
                  })
                }
                className="border p-2 rounded w-full"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSheet;
