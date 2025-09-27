import React from 'react';
import Banner from './Banner';
import Testimonials from './Testimonials';
import { Helmet } from 'react-helmet-async';
import ServicesSection from './Service';

const Home = () => {
    return (
        <div>
            <Helmet>
                    <title>Staffonic | Home</title>
                  </Helmet>
            <Banner></Banner>
            <ServicesSection></ServicesSection>
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;