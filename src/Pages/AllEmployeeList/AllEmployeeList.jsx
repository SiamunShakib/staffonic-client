import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AllEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editingSalary, setEditingSalary] = useState(null);
  const [newSalary, setNewSalary] = useState("");

  // fetch verified users (both employee + HR)
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        const verifiedUsers = data.filter((u) => u.isVerified);
        setEmployees(verifiedUsers);
      });
  }, []);

  // Fire employee
  const fireEmployee = (emp) => {
    Swal.fire({
      title: `Fire ${emp.name}?`,
      text: "They won’t be able to login anymore!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Fire!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/users/${emp._id}/fire`, {
          method: "PATCH",
        })
          .then((res) => res.json())
          .then(() => {
            setEmployees((prev) =>
              prev.map((e) =>
                e._id === emp._id ? { ...e, fired: true } : e
              )
            );
            Swal.fire("Fired!", `${emp.name} has been fired.`, "success");
          });
      }
    });
  };

// Toggle HR/Employee
const toggleRole = (emp) => {
  const newRole = emp.role === "hr" ? "employee" : "hr";

  fetch(`http://localhost:5000/users/${emp._id}/toggleRole`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: newRole }),
  })
    .then((res) => res.json())
    .then(() => {
      setEmployees((prev) =>
        prev.map((e) =>
          e._id === emp._id ? { ...e, role: newRole } : e
        )
      );
      Swal.fire("Success", `${emp.name} is now ${newRole}`, "success");
    })
    .catch((err) => {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    });
};


  // Adjust Salary
  const saveSalary = (empId) => {
    fetch(`http://localhost:5000/users/${empId}/salary`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ salary: newSalary }),
    })
      .then((res) => res.json())
      .then(() => {
        setEmployees((prev) =>
          prev.map((e) =>
            e._id === empId ? { ...e, salary: newSalary } : e
          )
        );
        setEditingSalary(null);
        setNewSalary("");
        Swal.fire("Updated", "Salary adjusted successfully", "success");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Panel - Manage Employees</h2>
      <table className="w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Designation</th>
            <th className="p-2">Role</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Make HR</th>
            <th className="p-2">Fire</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {employees.map((emp) => (
            <tr key={emp._id} className="border-t">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.designation}</td>
              <td className="p-2 capitalize">{emp.role}</td>
              <td className="p-2">
                {editingSalary === emp._id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="border p-1 rounded w-24"
                    />
                    <button
                      onClick={() => saveSalary(emp._id)}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{emp.salary}</span>
                    <button
                      onClick={() => {
                        setEditingSalary(emp._id);
                        setNewSalary(emp.salary);
                      }}
                      className="text-blue-600 ml-2"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </td>
              <td className="p-2">
                {!emp.fired ? (
                  <button onClick={() => toggleRole(emp)}>
                    {emp.role === "hr" ? "Make Employee" : "Make HR"}
                    </button>

                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">
                {emp.fired ? (
                  <span className="text-red-500 font-bold">Fired</span>
                ) : (
                  <button
                    onClick={() => fireEmployee(emp)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Fire
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllEmployeeList;
