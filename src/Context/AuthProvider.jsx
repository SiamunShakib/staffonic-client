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
    const [user, setUser] = useState(null);
    const provider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    }

    const logOut = () => signOut(auth);

    const updateUser = (updatedData) => {
        setLoading(true);
        return updateProfile(auth.currentUser, updatedData);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch full user from backend
                    const res = await fetch(`http://localhost:5000/users?email=${currentUser.email}`);
                    const data = await res.json();
                    if (data.length > 0) {
                        setUser(data[0]); // backend user with role, fired, etc.
                    } else {
                        // fallback if user not in backend yet
                        setUser({
                            name: currentUser.displayName || "",
                            email: currentUser.email,
                            photoURL: currentUser.photoURL || "",
                            role: "employee", // default
                            fired: false      // default
                        });
                    }
                } catch (err) {
                    console.error(err);
                    setUser({
                        name: currentUser.displayName || "",
                        email: currentUser.email,
                        photoURL: currentUser.photoURL || "",
                        role: "employee",
                        fired: false
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    const authInfo = {
        user,
        setUser,
        loading,
        createUser,
        loginUser,
        logOut,
        updateUser,
        loginWithGoogle
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
