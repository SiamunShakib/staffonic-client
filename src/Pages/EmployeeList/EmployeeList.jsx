import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });

    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setIsLoading(false);
        
        // Calculate verified and unverified counts
        const verified = data.filter(emp => emp.isVerified).length;
        setVerifiedCount(verified);
        setUnverifiedCount(data.length - verified);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const toggleVerify = async (id) => {
    const res = await fetch(`http://localhost:5000/users/${id}/verify`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (data.modifiedCount > 0) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, isVerified: !emp.isVerified } : emp
        )
      );
      
      // Update counts
      setVerifiedCount(prev => {
        const employee = employees.find(emp => emp._id === id);
        if (employee && employee.isVerified) {
          return prev - 1; // Was verified, now unverified
        } else {
          return prev + 1; // Was unverified, now verified
        }
      });
      
      setUnverifiedCount(prev => {
        const employee = employees.find(emp => emp._id === id);
        if (employee && employee.isVerified) {
          return prev + 1; // Was verified, now unverified
        } else {
          return prev - 1; // Was unverified, now verified
        }
      });
    }
  };

  const handlePay = (emp) => {
    if (!emp.isVerified) {
      Swal.fire("Error", "Employee not verified!", "error");
      return;
    }
    setSelectedEmployee(emp);
    setShowPayModal(true);
  };

  const submitPayment = async () => {
    const payload = {
      userId: selectedEmployee._id,
      email: selectedEmployee.email,
      name: selectedEmployee.name,
      salary: selectedEmployee.salary,
      month,
      year,
      status: "pending",
    };

    const res = await fetch("http://localhost:5000/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.insertedId) {
      Swal.fire("Success", "Payment request sent!", "success");
      setShowPayModal(false);
      setMonth("");
      setYear("");
    }
  };

  const columns = [
    { 
      accessorKey: "name", 
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mr-3 shadow-md">
            {row.original.name.charAt(0).toUpperCase()}
            <img src={row.original.photoURL} alt="" />
          </div>
          <span className="font-medium text-gray-800">{row.original.name}</span>
        </div>
      ),
    },
    { 
      accessorKey: "email", 
      header: "Email",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <button
            onClick={() => toggleVerify(row.original._id)}
            className={`text-xl transition-all duration-300 transform hover:scale-110 ${
              row.original.isVerified ? "text-green-600" : "text-yellow-500"
            }`}
            data-aos="flip-left"
            title={row.original.isVerified ? "Click to unverify" : "Click to verify"}
          >
            {row.original.isVerified ? "✅" : "❌"}
          </button>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.original.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {row.original.isVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
      ),
    },
    { 
      accessorKey: "bank_account_no", 
      header: "Bank Account",
      cell: ({ row }) => (
        <span className="font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">
          {row.original.bank_account_no || "N/A"}
        </span>
      ),
    },
    { 
      accessorKey: "salary", 
      header: "Salary",
      cell: ({ row }) => (
        <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
          ${row.original.salary}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              row.original.isVerified
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handlePay(row.original)}
            disabled={!row.original.isVerified}
            data-aos="zoom-in"
          >
            Pay
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate(`/employees/${row.original.email}`)}
            data-aos="zoom-in"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Helmet>
              <title>Staffonic | Employee List</title>
            </Helmet>
      <div 
        className="max-w-7xl mx-auto"
        data-aos="fade-up"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg mb-6">
          <h2 className="text-3xl font-bold mb-2">Employee Management</h2>
          <p className="text-blue-100">Logged in as: {user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500" data-aos="fade-right">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Employees</p>
                <h3 className="text-3xl font-bold text-gray-800">{employees.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500" data-aos="fade-up">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Verified Employees</p>
                <h3 className="text-3xl font-bold text-gray-800">{verifiedCount}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500" data-aos="fade-left">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Verification</p>
                <h3 className="text-3xl font-bold text-gray-800">{unverifiedCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                          {hg.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                              data-aos="fade-right"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {table.getRowModel().rows.map((row, index) => (
                        <tr 
                          key={row.id} 
                          className="hover:bg-blue-50 transition-colors duration-200"
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {employees.length === 0 && !isLoading && (
                  <div 
                    className="text-center py-12 text-gray-500"
                    data-aos="fade-in"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-lg">No employees found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          data-aos="fade-in"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            data-aos="zoom-in"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
              <h3 className="text-xl font-semibold">Pay {selectedEmployee.name}</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Salary Amount</label>
                <div className="text-2xl font-bold text-blue-700">${selectedEmployee.salary}</div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Month</label>
                <input
                  type="text"
                  placeholder="e.g. January"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2023"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPayment}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;