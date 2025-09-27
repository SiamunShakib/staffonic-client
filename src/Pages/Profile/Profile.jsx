import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';


import { 
    FaUser, 
    FaEnvelope, 
    FaUserTag, 
    FaCalendar, 
    FaMoneyBillWave 
} from 'react-icons/fa';
import { MdVerified, MdDangerous } from 'react-icons/md';

const Profile = () => {
    const { user, userData } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    const getStatusColor = () => {
        if (userData?.fired) return 'text-red-600';
        if (userData?.isVerified) return 'text-green-600';
        return 'text-yellow-600';
    };

    const getStatusText = () => {
        if (userData?.fired) return 'Account Terminated';
        if (userData?.isVerified) return 'Verified Account';
        return 'Pending Verification';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto">
                
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" data-aos="fade-up">
                    
                    {/* Profile Header */}
                    <div className="text-center mb-6">
                        <div className="relative inline-block mb-4">
                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt={user?.displayName} 
                                    className="w-24 h-24 rounded-full border-4 border-blue-100 mx-auto"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                                    <span className="text-2xl font-bold text-white">
                                        {getInitials(userData?.name)}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {userData?.name || 'Staff Member'}
                        </h1>
                        
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {userData?.role || 'Employee'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                                {getStatusText()}
                            </span>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-4">
                        <InfoRow Icon={FaEnvelope} label="Email" value={userData?.email} />
                        <InfoRow Icon={FaUserTag} label="Role" value={userData?.role} />
                        {userData?.salary && (
                            <InfoRow Icon={FaMoneyBillWave} label="Salary" value={`$${userData.salary}`} />
                        )}
                        <InfoRow 
                            Icon={FaCalendar} 
                            label="Member Since" 
                            value={user?.metadata?.creationTime ? 
                                new Date(user.metadata.creationTime).toLocaleDateString() : 
                                'Unknown'
                            } 
                        />
                    </div>

                    {/* Status Indicator */}
                    <div className={`mt-6 p-3 rounded-lg text-center ${
                        userData?.fired ? 'bg-red-50 text-red-700' :
                        userData?.isVerified ? 'bg-green-50 text-green-700' :
                        'bg-yellow-50 text-yellow-700'
                    }`}>
                        {userData?.fired ? (
                            <div className="flex items-center justify-center space-x-2">
                                <MdDangerous />
                                <span className="font-medium">Account has been terminated</span>
                            </div>
                        ) : userData?.isVerified ? (
                            <div className="flex items-center justify-center space-x-2">
                                <MdVerified />
                                <span className="font-medium">Account is active and verified</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-2">
                                <FaUser />
                                <span className="font-medium">Waiting for administrator verification</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Simple Footer */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                    Staffonic ID: {user?.uid?.substring(0, 8)}...
                </div>
            </div>
        </div>
    );
};


const InfoRow = ({ Icon, label, value }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Icon className="text-blue-500 text-lg" />
        <div className="flex-1">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="font-medium text-gray-800">{value || 'Not specified'}</div>
        </div>
    </div>
);

export default Profile;
