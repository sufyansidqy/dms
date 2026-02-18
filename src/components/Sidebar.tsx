'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, Folder, Settings, LogOut, LogIn, Users } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const user = session?.user;
    // @ts-ignore
    const isAdmin = user?.role === 'Admin';

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.25rem' }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                        color: 'white'
                    }}>
                        Q2 TECHNOLOGIES
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#94A3B8'
                    }}>
                        Document Management
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                {user ? (
                    <>
                        <NavItem href="/" label="Dashboard" icon={<Home size={20} />} active={pathname === '/'} />
                        <NavItem href="/projects" label="Projects" icon={<Folder size={20} />} active={isActive('/projects')} />
                        <NavItem href="/settings" label="Settings" icon={<Settings size={20} />} active={isActive('/settings')} />
                        {isAdmin && (
                            <NavItem href="/admin/users" label="User Management" icon={<Users size={20} />} active={isActive('/admin/users')} />
                        )}
                    </>
                ) : (
                    <NavItem href="/login" label="Login" icon={<LogIn size={20} />} active={isActive('/login')} />
                )}
            </nav>

            {/* User Profile / Login */}
            {user ? (
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: 'var(--color-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: '0.875rem'
                        }}>
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name || user?.email}
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                {/* @ts-ignore */}
                                {user?.role || 'User'}
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: '4px' }}
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            ) : status !== 'loading' && (
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link href="/login" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', padding: '0.625rem', borderRadius: '8px',
                        backgroundColor: 'var(--color-accent)', color: 'white',
                        textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                    }}>
                        <LogIn size={16} />
                        Masuk
                    </Link>
                </div>
            )}
        </aside>
    );
}

function NavItem({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active: boolean }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            color: active ? 'var(--color-accent)' : 'white',
            backgroundColor: active ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
            transition: 'all 0.2s',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: active ? 500 : 400
        }}>
            <span>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
