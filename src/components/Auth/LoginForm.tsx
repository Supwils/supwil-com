'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
    onSuccess?: () => void;
}

interface FormData {
    username: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { login } = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-2xl p-8 shadow-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                        Admin Login
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70">
                        Enter your credentials to access the admin panel
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-[var(--text-color)] mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="
                                w-full px-4 py-3 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                text-[var(--text-color)]
                                placeholder-[var(--text-color)]/50
                                focus:outline-none 
                                focus:border-[var(--main-color)]
                                focus:ring-2 
                                focus:ring-[var(--main-color)]/20
                                transition-all duration-200
                            "
                            placeholder="Enter your username"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[var(--text-color)] mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="
                                w-full px-4 py-3 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                text-[var(--text-color)]
                                placeholder-[var(--text-color)]/50
                                focus:outline-none 
                                focus:border-[var(--main-color)]
                                focus:ring-2 
                                focus:ring-[var(--main-color)]/20
                                transition-all duration-200
                            "
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
                            w-full py-3 px-4
                            bg-[var(--main-color)]
                            text-white
                            font-medium
                            rounded-xl
                            hover:bg-[var(--main-color)]/90
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[var(--main-color)]/50
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition-all duration-200
                            flex items-center justify-center gap-2
                        "
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--text-color)] opacity-50">
                        Authorized personnel only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
