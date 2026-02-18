export default function SettingsPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Settings
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                Manage your preferences and account settings.
            </p>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>General</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Settings will be available once authentication is configured with your Google account.
                </p>
            </div>
        </div>
    );
}
