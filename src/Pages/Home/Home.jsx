import React from 'react';
import Banner from './Banner';
import Random from './Random';
import Testimonials from './Testimonials';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div>
            <Helmet>
                    <title>Staffonic | Home</title>
                  </Helmet>
            <Banner></Banner>
            <Random></Random>
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;