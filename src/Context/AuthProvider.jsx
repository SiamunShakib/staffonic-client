import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { auth } from '../../firebase.init';

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);        // Firebase user
    const [userData, setUserData] = useState(null); // Backend user
    const provider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    };

    const logOut = () => signOut(auth);

    const updateUser = (updatedData) => {
        setLoading(true);
        return updateProfile(auth.currentUser, updatedData);
    };

    // Fetch userData from backend
    const fetchUserData = async (currentUser) => {
        try {
            const res = await fetch(`http://localhost:5000/users?email=${currentUser.email}`);
            const data = await res.json();
            if (data.length > 0) setUserData(data[0]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // set default immediately
                setUserData({
                    name: currentUser.displayName || "",
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || "",
                    role: "employee",
                    fired: false
                });

                // fetch backend data immediately
                fetchUserData(currentUser);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    // Poll backend every 5 seconds if user exists
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => fetchUserData(user), 5000);
        return () => clearInterval(interval);
    }, [user]);

    const authInfo = {
        user,
        userData,  
        setUser,
        setUserData,
        loading,
        createUser,
        loginUser,
        logOut,
        updateUser,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
