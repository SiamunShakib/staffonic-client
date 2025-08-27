import React, { useEffect, useState } from "react";

const Progress = () => {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // fetch all works + users
  useEffect(() => {
    fetch("http://localhost:5000/workRecordsAll")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data);
        setFilteredWorks(data);
      });

    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Progress</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Employee dropdown */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp.email}>
              {emp.name}
            </option>
          ))}
        </select>

        {/* Month dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
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

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Employee</th>
            <th className="p-2">Task</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorks.map((work) => (
            <tr key={work._id} className="border-t text-center">
              <td className="p-2">{work.email}</td>
              <td className="p-2">{work.task}</td>
              <td className="p-2">{work.hours}</td>
              <td className="p-2">
                {new Date(work.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Progress;
