import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const EmployeeDetails = () => {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data.find((u) => u.email === email));
      });

    fetch("http://localhost:5000/payments")
      .then((res) => res.json())
      .then((data) => setPayments(data.filter((p) => p.email === email)));
  }, [email]);

  return (
    <div className="p-6">
      {employee && (
        <>
          <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
          <img src={employee.photoURL} alt="" className="w-32 h-32 rounded-full mb-4" />
          <p>Email: {employee.email}</p>
          <p>Designation: {employee.designation || "N/A"}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Salary vs Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payments}>
              <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom" }} />
              <YAxis label={{ value: "Salary", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="salary" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default EmployeeDetails;
