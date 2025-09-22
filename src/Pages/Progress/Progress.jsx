import React, { useEffect, useState } from "react";
import { FiFilter, FiUser, FiCalendar, FiTrendingUp, FiClock, FiCheckCircle } from "react-icons/fi";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from "react-helmet-async";

const Progress = () => {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  // fetch all works + users
  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      fetch("http://localhost:5000/workRecordsAll").then(res => {
        if (!res.ok) throw new Error('Failed to fetch work records');
        return res.json();
      }),
      fetch("http://localhost:5000/users").then(res => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        return res.json();
      })
    ])
    .then(([workData, employeeData]) => {
      setWorks(workData);
      setFilteredWorks(workData);
      setEmployees(employeeData);
      setError(null);
    })
    .catch(err => {
      console.error('Fetch error:', err);
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // filter works when employee or month changes
  useEffect(() => {
    let result = [...works];

    if (selectedEmployee) {
      result = result.filter((w) => w.email === selectedEmployee);
    }

    if (selectedMonth) {
      result = result.filter((w) => {
        if (!w.date) return false;
        const workMonth = new Date(w.date).getMonth() + 1; // month 1-12
        return workMonth.toString() === selectedMonth;
      });
    }

    setFilteredWorks(result);
  }, [selectedEmployee, selectedMonth, works]);

  // Calculate total hours for summary
  const totalHours = filteredWorks.reduce((total, work) => total + (parseFloat(work.hours) || 0), 0);
  const totalTasks = filteredWorks.length;

  // Safe function to get initial from email
  const getInitial = (email) => {
    if (!email || typeof email !== 'string') return '?';
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 animate-pulse">
            <FiTrendingUp size={28} />
          </div>
          <h2 className="text-xl font-semibold text-indigo-800">Loading employee data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <FiTrendingUp size={28} />
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Helmet>
              <title>Staffonic | Progress</title>
            </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-8 py-6 rounded-xl bg-white shadow-lg"
          data-aos="fade-down"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FiTrendingUp size={28} />
          </div>
          <h2 className="text-3xl font-bold text-indigo-800 mb-2">Employee Progress Tracker</h2>
          <p className="text-indigo-500">Monitor work records and productivity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl p-6 shadow-lg flex items-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="mr-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUser size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employees</h3>
              <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-lg flex items-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="mr-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-lg flex items-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="mr-4 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <FiClock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
              <p className="text-2xl font-bold text-gray-800">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div 
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
          data-aos="fade-up"
        >
          <div className="flex items-center mb-4">
            <FiFilter className="text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Records</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Employee dropdown */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp.email}>
                      {emp.name || emp.email || 'Unknown Employee'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Month dropdown */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50 text-indigo-800">
                  <th className="py-4 px-6 text-left font-semibold">Employee</th>
                  <th className="py-4 px-6 text-left font-semibold">Task</th>
                  <th className="py-4 px-6 text-left font-semibold">Hours</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWorks.length > 0 ? (
                  filteredWorks.map((work, index) => (
                    <tr 
                      key={work._id || index} 
                      className="hover:bg-indigo-50 transition-colors duration-150"
                      data-aos="fade-right"
                      data-aos-delay={index * 50}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                            {getInitial(work.email)}
                          </div>
                          <span>{work.email || 'Unknown Employee'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{work.task || 'No task description'}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {work.hours || '0'} hrs
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {work.date ? (
                          new Date(work.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        ) : (
                          'No date'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No records found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        {filteredWorks.length > 0 && (
          <div 
            className="mt-4 text-sm text-gray-600"
            data-aos="fade-up"
          >
            Showing {filteredWorks.length} of {works.length} records
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;