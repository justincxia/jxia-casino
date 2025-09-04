import { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import type { User as UserType } from '../services/api';

interface LoginProps {
    coins: number;
    isLoggedIn: boolean;
    username: string;
    onLogin: (user: UserType, token: string) => void;
    onLogout: () => void;
    onTopUp: (newCoins: number) => void;
}

export default function Login({ coins, isLoggedIn, username, onLogin, onLogout, onTopUp }: LoginProps) {
    const [inputUsername, setInputUsername] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const clearForm = () => {
        setInputUsername('');
        setInputEmail('');
        setInputPassword('');
        setError('');
    };

    useEffect(() => {
        clearForm();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            const response = await authAPI.login({
                email: inputEmail,
                password: inputPassword
            });

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            onLogin(response.user, response.token);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({
                username: inputUsername,
                email: inputEmail,
                password: inputPassword
            });

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            onLogin(response.user, response.token);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTopUp = async () => {
        setLoading(true);
        try {
            const response = await authAPI.topUpCoins();
            onTopUp(response.user.coins);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Top up failed');
        } finally {
            setLoading(false);
        }
    };

    if (isLoggedIn) {
        return (
            <div>
                <Header coins={coins} isLoggedIn={isLoggedIn} username={username} />

                <main style={{ padding: 'clamp(16px, 4vw, 48px)' }}>
                    <div>
                        <div>
                            <UserIcon style={{
                                width: 'clamp(48px, 8vw, 80px)',
                                height: 'clamp(48px, 8vw, 80px)'
                            }} />
                            <h2 style={{ fontSize: 'clamp(20px, 4vw, 32px)' }}>
                                Welcome back!
                            </h2>
                            <p>Logged in as: {username}</p>
                        </div>

                        <div>
                            <div>
                                Current Coins: {coins}
                            </div>

                            <button onClick={handleTopUp} disabled={loading}>
                                {loading ? 'Loading...' : 'Top Up Coins (Min 100)'}
                            </button>

                            <button onClick={() => {
                                clearForm();
                                onLogout();
                            }}>
                                Logout
                            </button>
                        </div>

                        <div>
                            <Link to="/">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header coins={coins} isLoggedIn={isLoggedIn} username={username} />

            <main style={{ padding: 'clamp(16px, 4vw, 48px)' }}>
                <div>
                    <div>
                        <UserIcon style={{
                            width: 'clamp(48px, 8vw, 80px)',
                            height: 'clamp(48px, 8vw, 80px)'
                        }} />
                        <h2 style={{
                            fontSize: 'clamp(20px, 4vw, 32px)'
                        }}>
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        {error && (
                            <div>
                                <p>
                                    {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                            {isRegistering && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={inputUsername}
                                        onChange={(e) => setInputUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={inputPassword}
                                    onChange={(e) => setInputPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
                            </button>
                        </form>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    clearForm();
                                    setIsRegistering(!isRegistering);
                                }}
                            >
                                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                            </button>
                        </div>

                        <div>
                            New users start with 100 coins
                        </div>
                    </div>

                    <div>
                        <Link to="/">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}