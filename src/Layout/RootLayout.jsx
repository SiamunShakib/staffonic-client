import React from 'react';
import { Outlet } from 'react-router';
import Home from '../Pages/Home/Home';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const RootLayout = () => {
    return (
        <div className='min-h-screen flex flex-col  '>
            <Navbar></Navbar>
            <div className='flex-grow mx-auto max-w-7xl w-full '>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;