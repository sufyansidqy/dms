import { getProjects, getDashboardStats } from '@/lib/data';
import Link from 'next/link';

export default async function Dashboard() {
  const [projects, stats] = await Promise.all([getProjects(), getDashboardStats()]);

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Overview of your document management system</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Active Projects" value={stats.activeProjects} icon="📁" color="var(--color-accent)" />
        <StatCard label="Total Documents" value={stats.totalDocuments} icon="📄" color="var(--color-success)" />
        <StatCard label="Pending Reviews" value={stats.pendingReviews} icon="⏳" color="#F59E0B" />
      </div>

      {/* Recent Projects */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recent Projects</h2>
          <Link href="/projects" style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
        </div>
        {projects.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No projects yet. <Link href="/projects" style={{ color: 'var(--color-accent)' }}>Create one</Link>
          </div>
        ) : (
          <div>
            {projects.slice(0, 5).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{project.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{project.clientName || 'No client'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px',
                      fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: project.status === 'Active' ? '#D1FAE5' : '#F1F5F9',
                      color: project.status === 'Active' ? '#065F46' : '#475569',
                    }}>{project.status}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        backgroundColor: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem'
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{label}</div>
      </div>
    </div>
  );
}
