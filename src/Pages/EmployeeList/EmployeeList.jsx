import React, { useEffect, useState, use } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import {useReactTable,getCoreRowModel,flexRender,} from "@tanstack/react-table";
import Swal from "sweetalert2";

const EmployeeList = () => {
  const { user } = use(AuthContext); // logged in HR
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  // toggle verify
  const toggleVerify = async (id) => {
    const res = await fetch(`http://localhost:5000/users/${id}/verify`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (data.modifiedCount > 0) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, isVerified: data.isVerified } : emp
        )
      );
    }
  };

  // open modal
  const handlePay = (emp) => {
    if (!emp.isVerified) {
      Swal.fire("Error", "Employee not verified!", "error");
      return;
    }
    setSelectedEmployee(emp);
    setShowPayModal(true);
  };

  // send payment
  const submitPayment = async () => {
    const payload = {
      userId: selectedEmployee._id,
      email: selectedEmployee.email,
      salary: selectedEmployee.salary,
      month,
      year,
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

  // table columns
  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <button
          onClick={() => toggleVerify(row.original._id)}
          className="text-xl"
        >
          {row.original.isVerified ? "✅" : "❌"}
        </button>
      ),
    },
    { accessorKey: "bankAccount", header: "Bank Account" },
    { accessorKey: "salary", header: "Salary" },
    {
      header: "Pay",
      cell: ({ row }) => (
        <button
          className={`px-3 py-1 rounded ${
            row.original.isVerified
              ? "bg-green-600 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
          onClick={() => handlePay(row.original)}
          disabled={!row.original.isVerified}
        >
          Pay
        </button>
      ),
    },
    {
      header: "Details",
      cell: ({ row }) => (
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => navigate(`/details/${row.original.email}`)}
        >
          Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List (HR)--{user.email}</h2>
      <table className="min-w-full border rounded">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-semibold mb-3">Pay {selectedEmployee.name}</h3>
            <p className="mb-2">Salary: {selectedEmployee.salary}</p>
            <input
              type="text"
              placeholder="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
