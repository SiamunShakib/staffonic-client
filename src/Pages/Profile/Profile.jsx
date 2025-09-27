import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Profile = () => {
    const {user, userData} = useContext(AuthContext)
    console.log({user})

    return (
        <div>
            <h1>{userData?.name}</h1>
            <h1>{userData?.email}</h1>
            <h1>{userData?.role}</h1>
            <img src={user?.photoURL} alt={user?.displayName} />
        </div>
    );
};

export default Profile;