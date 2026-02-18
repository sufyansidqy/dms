'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const NO_SIDEBAR_PATHS = ['/login', '/api'];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showSidebar = !NO_SIDEBAR_PATHS.some(p => pathname?.startsWith(p));

    if (!showSidebar) {
        return <>{children}</>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <Sidebar />
            <main style={{
                marginLeft: '260px',
                padding: '2rem',
                minHeight: '100vh'
            }}>
                {children}
            </main>
        </div>
    );
}
