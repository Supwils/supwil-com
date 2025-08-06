'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () =>
{
    const context = useContext(AuthContext);
    if (!context)
    {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) =>
{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() =>
    {
        checkAuth();
    }, []);

    const checkAuth = async () =>
    {
        try
        {
            const response = await fetch('/api/auth/check');
            const data = await response.json();

            if (data.isAuthenticated)
            {
                setUser(data.user);
                setIsAuthenticated(true);
            } else
            {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error)
        {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally
        {
            setIsLoading(false);
        }
    };

    const login = async (username, password) =>
    {
        try
        {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success)
            {
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true, message: data.message };
            } else
            {
                return { success: false, message: data.message };
            }
        } catch (error)
        {
            console.error('Login failed:', error);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const logout = async () =>
    {
        try
        {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });

            setUser(null);
            setIsAuthenticated(false);
        } catch (error)
        {
            console.error('Logout failed:', error);
            // Still clear local state even if API call fails
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 