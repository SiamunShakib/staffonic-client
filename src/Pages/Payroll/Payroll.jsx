import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const Payroll = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    totalAmount: 0
  });

  const [loading, setLoading] = useState(true);

  // Fetch pending payments
  const fetchPayments = () => {
    setLoading(true);
    fetch("http://localhost:5000/payments")
      .then((res) => res.json())
      .then((data) => {
        // Sort payments so the latest comes first
        const sortedPayments = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
          return dateB - dateA;
        });
        setPayments(sortedPayments);
        
        // Calculate stats
        const pendingCount = data.filter(p => p.status === "pending").length;
        const paidCount = data.filter(p => p.status === "paid").length;
        const totalAmount = data.reduce((sum, p) => sum + (parseFloat(p.salary) || 0), 0);
        
        setStats({
          total: data.length,
          pending: pendingCount,
          paid: paidCount,
          totalAmount: totalAmount
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle payment
  const handlePay = (paymentId) => {
    const currentDate = new Date().toISOString();

    fetch(`http://localhost:5000/payments/${paymentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid", paymentDate: currentDate }),
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Payment executed successfully!",
          icon: "success",
          background: "#ffffff",
          color: "#111827",
          customClass: {
            popup: 'rounded-xl shadow-2xl'
          }
        });
        setPayments(prev =>
          prev.map(p =>
            p._id === paymentId
              ? { ...p, status: "paid", paymentDate: currentDate }
              : p
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          paid: prev.paid + 1
        }));
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Payment failed!",
          icon: "error",
          background: "#ffffff",
          color: "#111827",
          customClass: {
            popup: 'rounded-xl shadow-2xl'
          }
        });
      });
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen  p-6">
      <Helmet>
              <title>Staffonic | Payroll</title>
            </Helmet>
      <div className="max-w-7xl px-3 md:px-5 mx-auto">
        
        {/* Loader Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading payroll data...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Payroll Management
              </h1>
              <p className="text-gray-600 text-lg">Process and approve employee payments with ease</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 rounded-xl text-white shadow-md mr-4">
                    <i className="fas fa-file-invoice-dollar text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Payments</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-xl text-white shadow-md mr-4">
                    <i className="fas fa-clock text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pending Approval</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-xl text-white shadow-md mr-4">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.paid}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-md mr-4">
                    <i className="fas fa-money-bill-wave text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                    <h3 className="text-2xl font-bold text-gray-800">${stats.totalAmount.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payments Table */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Payment Requests</h2>
                  <button 
                    onClick={fetchPayments}
                    className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-sync-alt"></i>
                    Refresh
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100/70 text-gray-600">
                        <th className="p-5 text-left font-semibold rounded-tl-xl">Employee</th>
                        <th className="p-5 text-left font-semibold">Salary</th>
                        <th className="p-5 text-left font-semibold">Period</th>
                        <th className="p-5 text-left font-semibold">Payment Date</th>
                        <th className="p-5 text-center font-semibold">Status</th>
                        <th className="p-5 text-center font-semibold rounded-tr-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-10 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <div className="bg-indigo-100 p-5 rounded-full mb-4">
                                <i className="fas fa-file-invoice-dollar text-3xl text-indigo-500"></i>
                              </div>
                              <p className="text-lg font-medium text-gray-600">No payment requests found</p>
                              <p className="text-gray-500 mt-2">All payments have been processed</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        payments.map(payment => (
                          <tr key={payment._id} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                            <td className="p-5">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md mr-4 group-hover:scale-105 transition-transform duration-200">
                                  {getInitials(payment.name)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{payment.name || 'Unknown Employee'}</p>
                                  <p className="text-sm text-gray-500">{payment.email || 'No email'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="font-bold text-gray-800 text-lg">${payment.salary || '0'}</span>
                            </td>
                            <td className="p-5">
                              <div className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg inline-block">
                                <span className="font-medium">{payment.month || 'N/A'}</span>
                                <span className="mx-1">•</span>
                                <span>{payment.year || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              {payment.paymentDate ? (
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-medium">
                                  {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="p-5">
                              <div className="flex justify-center">
                                <span className={`px-4 py-1.5 rounded-full font-medium ${
                                  payment.status === "paid" 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-amber-100 text-amber-700"
                                }`}>
                                  {payment.status === "paid" ? "Approved" : "Pending"}
                                </span>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex justify-center">
                                <button
                                  disabled={payment.status === "paid"}
                                  onClick={() => handlePay(payment._id)}
                                  className={`px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                                    payment.status === "paid" 
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                  }`}
                                >
                                  <i className={`fas ${payment.status === "paid" ? "fa-check" : "fa-check-circle"}`}></i>
                                  <span>{payment.status === "paid" ? "Approved" : "Approve"}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payroll;