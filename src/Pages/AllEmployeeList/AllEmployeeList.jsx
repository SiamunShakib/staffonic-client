import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AllEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editingSalary, setEditingSalary] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    employees: 0,
    hrs: 0,
    fired: 0
  });

  // fetch verified users (both employee + HR)
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        const verifiedUsers = data.filter((u) => u.isVerified && u.role !== "admin");
        setEmployees(verifiedUsers);
        
        // Calculate stats
        const employeeCount = verifiedUsers.filter(u => u.role === "employee" && !u.fired).length;
        const hrCount = verifiedUsers.filter(u => u.role === "hr" && !u.fired).length;
        const firedCount = verifiedUsers.filter(u => u.fired).length;
        
        setStats({
          total: verifiedUsers.length,
          employees: employeeCount,
          hrs: hrCount,
          fired: firedCount
        });
      });
  }, []);

  // Fire employee
  const fireEmployee = (emp) => {
    Swal.fire({
      title: `Fire ${emp.name}?`,
      text: "They won't be able to login anymore!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Fire!",
      background: "#ffffff",
      color: "#111827"
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
            
            // Update stats
            setStats(prev => ({
              ...prev,
              employees: prev.employees - 1,
              fired: prev.fired + 1
            }));
            
            Swal.fire({
              title: "Fired!",
              text: `${emp.name} has been fired.`,
              icon: "success",
              background: "#ffffff",
              color: "#111827"
            });
          });
      }
    });
  };

  // Make HR
  const makeHR = (emp) => {
    fetch(`http://localhost:5000/users/${emp._id}/makeHR`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then(() => {
        setEmployees((prev) =>
          prev.map((e) =>
            e._id === emp._id ? { ...e, role: "hr" } : e
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          employees: prev.employees - 1,
          hrs: prev.hrs + 1
        }));
        
        Swal.fire({
          title: "Success",
          text: `${emp.name} is now HR`,
          icon: "success",
          background: "#ffffff",
          color: "#111827"
        });
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
        Swal.fire({
          title: "Updated",
          text: "Salary adjusted successfully",
          icon: "success",
          background: "#ffffff",
          color: "#111827"
        });
      });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employee Management</h1>
          <p className="text-gray-600">Admin Dashboard - Manage all employees and HR staff</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-indigo-500 p-3 rounded-lg mr-4 text-white">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Staff</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg mr-4 text-white">
                <i className="fas fa-user-tie text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Employees</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.employees}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg mr-4 text-white">
                <i className="fas fa-user-cog text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">HR Managers</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.hrs}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-red-100 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg mr-4 text-white">
                <i className="fas fa-user-slash text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Fired</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.fired}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Employee Table */}
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Directory</h2>
            
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-4 text-left">Employee</th>
                    <th className="p-4 text-left">Designation</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Salary</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-100 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{emp.name}</p>
                            <p className="text-sm text-gray-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{emp.designation || "Not specified"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.role === "hr" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"} ${emp.fired ? "bg-red-100 text-red-800" : ""}`}>
                          {emp.fired ? "Fired" : emp.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {editingSalary === emp._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newSalary}
                              onChange={(e) => setNewSalary(e.target.value)}
                              className="border border-gray-300 rounded-lg p-2 w-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Salary"
                            />
                            <button
                              onClick={() => saveSalary(emp._id)}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">${emp.salary}</span>
                            {!emp.fired && (
                              <button
                                onClick={() => {
                                  setEditingSalary(emp._id);
                                  setNewSalary(emp.salary);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {!emp.fired && emp.role === "employee" && (
                            <button
                              onClick={() => makeHR(emp)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <i className="fas fa-user-cog"></i>
                              <span>Make HR</span>
                            </button>
                          )}
                          
                          {!emp.fired ? (
                            <button
                              onClick={() => fireEmployee(emp)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <i className="fas fa-user-slash"></i>
                              <span>Fire</span>
                            </button>
                          ) : (
                            <span className="text-red-600 font-medium">Terminated</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {employees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-users text-4xl mb-4 opacity-50"></i>
                <p className="text-lg">No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeList;
