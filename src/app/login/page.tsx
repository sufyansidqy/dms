'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleDevLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Email tidak ditemukan. Pastikan email sudah terdaftar di sistem.');
        } else {
            router.push('/projects');
            router.refresh();
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg)',
            padding: '2rem',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        letterSpacing: '0.02em',
                    }}>
                        Q2 TECHNOLOGIES
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                        Document Management System
                    </div>
                </div>

                <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                    Masuk ke Akun Anda
                </h1>

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleDevLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@dms.com"
                            required
                            style={{
                                width: '100%',
                                padding: '0.625rem 0.875rem',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/projects' })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9375rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Masuk dengan Google
                    </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '1.5rem' }}>
                    Akun Admin default: <strong>admin@dms.com</strong>
                </p>
            </div>
        </div>
    );
}
