import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { FaChevronLeft, FaChevronRight, FaMoneyCheckAlt } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { Helmet } from "react-helmet-async";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("year-desc");
  const rowsPerPage = 5;

  useEffect(() => {
    if (!user?.email) return;
    fetch(`http://localhost:5000/payments/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => {
          if (a.year === b.year) return a.month.localeCompare(b.month);
          return a.year - b.year;
        });
        setPayments(sorted);
      });
  }, [user?.email]);

  const sortedPayments = [...payments].sort((a, b) => {
    if (sortBy === "year-desc") {
      if (a.year === b.year) return a.month.localeCompare(b.month);
      return b.year - a.year;
    } else if (sortBy === "year-asc") {
      if (a.year === b.year) return a.month.localeCompare(b.month);
      return a.year - b.year;
    } else if (sortBy === "amount-desc") {
      return (b.salary || 0) - (a.salary || 0);
    } else if (sortBy === "amount-asc") {
      return (a.salary || 0) - (b.salary || 0);
    }
    return 0;
  });

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((total, p) => total + Number(p.salary || 0), 0);

  const startIdx = (page - 1) * rowsPerPage;
  const currentRows = sortedPayments.slice(startIdx, startIdx + rowsPerPage);
  const totalPages = Math.ceil(sortedPayments.length / rowsPerPage);

  return (
    <div className="py-10 px-4 md:px-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <Helmet>
              <title>Staffonic | Payment History</title>
            </Helmet>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Payment History</h2>
            <p className="text-gray-600 mt-2">View your payment records and transaction history</p>
          </div>

          <div className="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-md flex items-center hover:scale-105 transition-transform">
            <div className="mr-4 p-3 bg-indigo-100 rounded-full">
              <FaMoneyCheckAlt className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-indigo-700">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="flex mb-6">
          <div className="bg-white rounded-xl shadow-sm px-4 py-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Payment Records (Grid) */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 font-semibold">
            <div>Month</div>
            <div>Year</div>
            <div>Amount</div>
            <div>Transaction ID</div>
            <div>Status</div>
          </div>

          {currentRows.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No payment records found.</div>
          ) : (
            currentRows.map((p) => (
              <Fade key={p._id} direction="up" triggerOnce>
                <div className="grid grid-cols-5 p-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                  <div className="font-medium text-gray-800">{p.month}</div>
                  <div className="text-gray-600">{p.year}</div>
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ${p.salary || 0}
                    </span>
                  </div>
                  <div className="text-gray-600 font-mono text-sm truncate">{p._id}</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.status === 'paid' ? 'bg-green-100 text-green-800' :
                      p.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {p.status === 'pending' ? "Pending" : p.status === 'paid' ? "Paid" : p.status}
                    </span>
                  </div>
                </div>
              </Fade>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <FaChevronLeft className="mr-1" /> Prev
            </button>
            
            <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl">
              Page {page} of {totalPages}
            </div>
            
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next <FaChevronRight className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
