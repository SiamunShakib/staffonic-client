import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
    FaUser, 
    FaEnvelope, 
    FaUserTag, 
    FaCalendar, 
    FaEdit, 
    FaKey, 
    FaCheckCircle, 
    FaMoneyBillWave,
    FaClock,
    FaBriefcase,
    FaChartLine,
    FaTimesCircle,
    FaCrown
} from 'react-icons/fa';
import { MdVerified, MdDangerous } from 'react-icons/md';

const Profile = () => {
    const { user, userData } = useContext(AuthContext);
    const [workRecords, setWorkRecords] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }, []);

    useEffect(() => {
        if (userData?.email) {
            fetchUserData();
        }
    }, [userData]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [workRes, paymentsRes] = await Promise.all([
                fetch(`http://localhost:5000/workRecords?email=${userData.email}`),
                fetch(`http://localhost:5000/payments/${userData.email}`)
            ]);

            const workData = await workRes.json();
            const paymentsData = await paymentsRes.json();

            setWorkRecords(workData);
            setPayments(paymentsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyWork = workRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        });

        const totalHours = monthlyWork.reduce((sum, record) => sum + (record.hours || 0), 0);
        const totalShifts = monthlyWork.length;
        const completedShifts = monthlyWork.filter(record => record.status === 'completed').length;
        const attendanceRate = totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 100;

        return {
            totalHours,
            totalShifts,
            attendanceRate: Math.round(attendanceRate),
            completedShifts
        };
    };

    const getRecentPayments = () => {
        return payments
            .sort((a, b) => new Date(b.year, b.month) - new Date(a.year, a.month))
            .slice(0, 3);
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const stats = calculateStats();
    const recentPayments = getRecentPayments();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Profile</h1>
                    <p className="text-gray-600">Manage your staff information and performance</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8" data-aos="zoom-in">
                    {/* Profile Header */}
                    <div className={`p-8 text-white ${userData?.fired ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt={user?.displayName} 
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 border-4 border-white flex items-center justify-center shadow-lg">
                                        <span className="text-2xl font-bold text-white">
                                            {getInitials(userData?.name)}
                                        </span>
                                    </div>
                                )}
                                <div className={`absolute bottom-0 right-0 rounded-full p-1 border-2 border-white ${
                                    userData?.fired ? 'bg-red-500' : userData?.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                                }`}>
                                    {userData?.fired ? <MdDangerous className="text-white text-sm" /> : 
                                     userData?.isVerified ? <MdVerified className="text-white text-sm" /> : 
                                     <FaCheckCircle className="text-white text-sm" />}
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">{userData?.name || 'Staff Member'}</h2>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            <div className="inline-flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                                <FaUserTag className="mr-2" />
                                                <span className="font-semibold capitalize">{userData?.role || 'employee'}</span>
                                            </div>
                                            {userData?.role === 'hr' && (
                                                <div className="inline-flex items-center bg-yellow-500 bg-opacity-20 px-4 py-2 rounded-full">
                                                    <FaCrown className="mr-2 text-yellow-300" />
                                                    <span className="font-semibold">HR Manager</span>
                                                </div>
                                            )}
                                            {userData?.fired && (
                                                <div className="inline-flex items-center bg-red-500 bg-opacity-20 px-4 py-2 rounded-full">
                                                    <FaTimesCircle className="mr-2 text-red-300" />
                                                    <span className="font-semibold">Terminated</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {userData?.salary && (
                                        <div className="mt-4 md:mt-0 text-center">
                                            <div className="text-2xl font-bold">{formatCurrency(userData.salary)}</div>
                                            <div className="text-sm opacity-90">Monthly Salary</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b">
                        <div className="flex overflow-x-auto">
                            {['overview', 'work', 'payments', 'settings'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-medium capitalize transition-all duration-200 ${
                                        activeTab === tab
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-blue-500'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'overview' && <OverviewTab userData={userData} stats={stats} recentPayments={recentPayments} />}
                        {activeTab === 'work' && <WorkTab workRecords={workRecords} />}
                        {activeTab === 'payments' && <PaymentsTab payments={payments} />}
                        {activeTab === 'settings' && <SettingsTab userData={userData} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ userData, stats, recentPayments }) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div data-aos="fade-right">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
                    <FaUser className="mr-2 text-blue-500" />
                    Personal Information
                </h3>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FaEnvelope className="text-blue-500 text-lg" />
                            <span className="font-medium">Email</span>
                        </div>
                        <span className="text-gray-700">{userData?.email}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FaUserTag className="text-green-500 text-lg" />
                            <span className="font-medium">Role</span>
                        </div>
                        <span className="text-gray-700 capitalize">{userData?.role}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FaCalendar className="text-purple-500 text-lg" />
                            <span className="font-medium">Status</span>
                        </div>
                        <span className={`font-semibold ${
                            userData?.fired ? 'text-red-600' : 
                            userData?.isVerified ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                            {userData?.fired ? 'Terminated' : userData?.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Stats */}
            <div data-aos="fade-left">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
                    <FaChartLine className="mr-2 text-green-500" />
                    This Month's Performance
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.totalShifts}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Shifts</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
                        <div className="text-sm text-gray-600 mt-1">Hours Worked</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</div>
                        <div className="text-sm text-gray-600 mt-1">Attendance</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.completedShifts}</div>
                        <div className="text-sm text-gray-600 mt-1">Completed</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Payments */}
        {recentPayments.length > 0 && (
            <div data-aos="fade-up">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    Recent Payments
                </h3>
                <div className="grid gap-3">
                    {recentPayments.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">
                                    {new Date(payment.year, payment.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                                <div className={`text-sm font-semibold ${
                                    payment.status === 'paid' ? 'text-green-600' : 
                                    payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {payment.status.toUpperCase()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">{formatCurrency(payment.amount)}</div>
                                {payment.paymentDate && (
                                    <div className="text-sm text-gray-600">
                                        Paid on {new Date(payment.paymentDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// Work Tab Component
const WorkTab = ({ workRecords }) => (
    <div data-aos="fade-up">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
            <FaBriefcase className="mr-2 text-blue-500" />
            Work History
        </h3>
        
        {workRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                <FaClock className="text-4xl mx-auto mb-3 text-gray-400" />
                <p>No work records found</p>
            </div>
        ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {workRecords
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <div className="font-medium">
                                {new Date(record.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <div className="text-sm text-gray-600">{record.shiftType || 'Regular Shift'}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg">{record.hours || 0}h</div>
                            <div className={`text-sm font-semibold ${
                                record.status === 'completed' ? 'text-green-600' : 
                                record.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                                {record.status?.toUpperCase() || 'PENDING'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// Payments Tab Component
const PaymentsTab = ({ payments }) => (
    <div data-aos="fade-up">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
            <FaMoneyBillWave className="mr-2 text-green-500" />
            Payment History
        </h3>
        
        {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                <FaMoneyBillWave className="text-4xl mx-auto mb-3 text-gray-400" />
                <p>No payment records found</p>
            </div>
        ) : (
            <div className="space-y-3">
                {payments
                    .sort((a, b) => new Date(b.year, b.month) - new Date(a.year, a.month))
                    .map((payment, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-lg">
                                {new Date(payment.year, payment.month - 1).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                })}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                            }`}>
                                {payment.status.toUpperCase()}
                            </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Amount:</span>
                                <div className="font-bold text-lg">{formatCurrency(payment.amount)}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Payment Date:</span>
                                <div>{payment.paymentDate ? 
                                    new Date(payment.paymentDate).toLocaleDateString() : 'Not paid yet'
                                }</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Method:</span>
                                <div>{payment.paymentMethod || 'Bank Transfer'}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// Settings Tab Component
const SettingsTab = ({ userData }) => (
    <div data-aos="fade-up">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center mb-4">
            <FaUser className="mr-2 text-blue-500" />
            Account Settings
        </h3>
        
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <button className="flex items-center space-x-3 p-4 border rounded-lg hover:border-blue-500 transition-all duration-200">
                    <FaEdit className="text-blue-500 text-xl" />
                    <div className="text-left">
                        <div className="font-medium">Edit Profile</div>
                        <div className="text-sm text-gray-600">Update your personal information</div>
                    </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-500 transition-all duration-200">
                    <FaKey className="text-green-500 text-xl" />
                    <div className="text-left">
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-gray-600">Update your login credentials</div>
                    </div>
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Account Status</h4>
                <p className="text-yellow-700 text-sm">
                    {userData?.fired ? 
                        'Your account has been terminated. Please contact HR for more information.' :
                    userData?.isVerified ? 
                        'Your account is verified and active.' :
                        'Your account is pending verification. You may have limited access until verified.'
                    }
                </p>
            </div>
        </div>
    </div>
);

export default Profile;