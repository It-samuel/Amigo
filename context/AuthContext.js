import React, { createContext, useContext, useState, useEffect } from 'react';

import {
    setLocalStoreData,
    removeLocalStoreData,
} from '../helper/localStorage';
import apiHelper from '../helper/apiHelper';
import { TOKEN } from '../constants/string';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await apiHelper.get('/user');
                setLoading(false);
                setUser(data);
            } catch (e) {
                logout();
                setLoading(false);
            }
        })();
    }, []);




    const logout = () => {
        setUser('');
        removeLocalStoreData(TOKEN);
    };

   async function  verifyOTP(phoneNumber,countryCode,otp){
    const {data}= await apiHelper.post("/auth/verifyOTP",{phoneNumber,countryCode,otp});
    if(data.status)
    return;
    const {userData,token}=data;
    setUser(userData);
    setLocalStoreData(TOKEN,token);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                setLoading,
                verifyOTP
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
