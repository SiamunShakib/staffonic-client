import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext); // logged in employee
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (!user?.email) return;
    fetch(`http://localhost:5000/payments/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        // sort by year, then month (earliest first)
        const sorted = data.sort((a, b) => {
          if (a.year === b.year) return a.month.localeCompare(b.month);
          return a.year - b.year;
        });
        setPayments(sorted);
      });
  }, [user?.email]);

  // pagination logic
  const startIdx = (page - 1) * rowsPerPage;
  const currentRows = payments.slice(startIdx, startIdx + rowsPerPage);
  const totalPages = Math.ceil(payments.length / rowsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Payment History ({user?.email})
      </h2>

      <table className="min-w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Month</th>
            <th className="p-2 text-left">Year</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Transaction ID</th>
            <th className="p-2 text-left">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.month}</td>
              <td className="p-2">{p.year}</td>
              <td className="p-2">${p.salary}</td>
              <td className="p-2">{p._id}</td>
              <td className="p-2" >
                {p.status === 'pending' ? "Pending" : p.status === 'approved' ? "Paid" : p.status}
              </td>
              
            </tr>
          ))}
          {currentRows.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
