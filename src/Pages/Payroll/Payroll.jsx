import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Payroll = () => {
  const [payments, setPayments] = useState([]);

  // Fetch pending payments
  const fetchPayments = () => {
    fetch("http://localhost:5000/payments")
      .then((res) => res.json())
      .then((data) => {
        // Highlighted Change: sort payments so the latest comes first
        const sortedPayments = data.sort((a, b) => {
          // Assuming 'createdAt' exists; fallback to _id timestamp if not
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
          return dateB - dateA; // latest first
        });
        setPayments(sortedPayments);
      })
      .catch(err => console.error(err));
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
        Swal.fire("Success", "Payment executed successfully!", "success");
        setPayments(prev =>
          prev.map(p =>
            p._id === paymentId
              ? { ...p, status: "paid", paymentDate: currentDate }
              : p
          )
        );
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "Payment failed!", "error");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payroll Management</h2>
      <table className="w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Employee Name</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Month</th>
            <th className="p-2">Year</th>
            <th className="p-2">Payment Date</th>
            <th className="p-2">Payment</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {payments.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4">No pending payments</td>
            </tr>
          ) : (
            payments.map(payment => (
              <tr key={payment._id} className="border-t">
                <td className="p-2">{payment.name}</td>
                <td className="p-2">{payment.salary}</td>
                <td className="p-2">{payment.month}</td>
                <td className="p-2">{payment.year}</td>
                <td className="p-2">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2">
                  <button
                    disabled={payment.status === "paid"}
                    onClick={() => handlePay(payment._id)}
                    className={`px-3 py-1 rounded text-white ${
                      payment.status === "paid" ? "bg-gray-400" : "bg-green-600"
                    }`}
                  >
                    {payment.status === "paid" ? "Approved" : "Approve"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;
