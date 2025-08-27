import {createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import PrivateRoute from "./PrivateRoute";
import WorkSheet from "../Pages/WorkSheet/WorkSheet";
import PaymentHistory from "../Pages/PaymentHistory/PaymentHistory";
import EmployeeList from "../Pages/EmployeeList/EmployeeList";
import EmployeeDetails from "../Pages/EmployeeList/EmployeeDetails";
import AllEmployeeList from "../Pages/AllEmployeeList/AllEmployeeList";
import Payroll from "../Pages/Payroll/Payroll";
import Progress from "../Pages/Progress/Progress";


export const Router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path: '/register',
          Component: Register
        },
        {
          path: '/login',
          Component: Login
        },
        {
          path: '/worksheet',
          element: <PrivateRoute><WorkSheet/></PrivateRoute>
        }
        ,{
          path: 'paymentHistory',
          element: <PrivateRoute><PaymentHistory/></PrivateRoute>
        },
       {
        path: '/employeeList',
        element: <PrivateRoute><EmployeeList/></PrivateRoute>
       },
       {
        path: '/employees/:email',
        element: <PrivateRoute><EmployeeDetails/></PrivateRoute>,
        loader: ({params}) => 
          fetch(`http://localhost:5000/employees/${params.email}`)
       },
       {
        path: '/progress',
        element: <PrivateRoute><Progress/></PrivateRoute>
       },
      {
         path: '/allEmployeeList',
       element: <PrivateRoute><AllEmployeeList/></PrivateRoute>
      },
      {
        path: '/payroll',
        element: <PrivateRoute><Payroll/></PrivateRoute>
      }
    ]
  },
]);