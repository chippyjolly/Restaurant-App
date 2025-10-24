import React, {createContext, useState, useEffect, useContext} from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);


export const AuthProvider = ({ children}) => {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const currentUser = AuthService.getCurrentUser();
        if (currentUser){
            setUser(currentUser);
        }
    }, []);

    const login = async (email, password) =>{
        const response = await AuthService.login(email, password);
        setUser(response);

        return response;
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const register = async (username, email, password, role) => {
        const response = await AuthService.register(username, email, password, role);
        return response;
    };

    const value = {user, login, logout, register};

    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}


