import React, { use } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Profile = () => {
    const {user} = use(AuthContext)

    return (
        <div>
            <h1>{user.displayName}</h1>
            <h1>{user.email}</h1>
            <img src={user.photoURL} alt={user.displayName} />
        </div>
    );
};

export default Profile;