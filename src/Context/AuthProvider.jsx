import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase.init';


const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const provider = new GoogleAuthProvider();


    const createUser = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const loginUser = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    };
    ;

    const loginWithGoogle = () =>{
        setLoading(true)
        return signInWithPopup(auth, provider)
    };
    

    const logOut = () => {
        return signOut(auth)
    }

    const updateUser = (updatedData) =>{
        setLoading(true);
        return updateProfile(auth.currentUser, updatedData);
    }



    useEffect(()=> {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
        })
        return ()=> unSubscribe();
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