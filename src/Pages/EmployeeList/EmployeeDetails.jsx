import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const EmployeeDetails = () => {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [payments, setPayments] = useState([]);

  const colors = [
    "#4f46e5",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#0ea5e9",
    "#9333ea",
    "#ea580c",
    "#14b8a6",
  ];

  useEffect(() => {
    // fetch employee
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data.find((u) => u.email === email));
      });

    // fetch paid payments
    fetch("http://localhost:5000/payments")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (p) => p.email === email && p.status === "paid"
        );
        // add monthYear field for X-axis
        const withMonthYear = filtered.map((p) => ({
          ...p,
          monthYear: `${p.month}-${p.year}`,
        }));
        setPayments(withMonthYear);
      });
  }, [email]);

  // custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { month, year, salary } = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{`${month}-${year}`}</p>
          <p>Salary: {salary}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <Helmet>
              <title>Staffonic | Details</title>
            </Helmet>
      {employee && (
        <>
          <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
          <img
            src={employee.photoURL}
            alt=""
            className="w-32 h-32 rounded-full mb-4"
          />
          <p>Email: {employee.email}</p>
          <p>Designation: {employee.designation || "N/A"}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Salary vs Month-Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payments}>
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="salary">
                {payments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default EmployeeDetails;
