import { Link } from 'react-router-dom';
import { AdminPageHeader, StatusBadge, TableShell, tdClass, thClass } from '../../components/admin/AdminPrimitives';
import { ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { cardClass } from '../../components/ui/styles';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { formatDateTime, STATUS_LABELS } from '../../lib/format';
import type { EnquiryStatus } from '../../types/api';

const STATUSES: EnquiryStatus[] = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];

export function AdminDashboardPage() {
  useDocumentMeta({ title: 'Dashboard | Admin', description: 'Admin dashboard.', path: '/admin/dashboard', noindex: true });
  const dashboard = useAsync((signal) => adminApi.dashboard(signal), []);

  if (dashboard.loading) return <LoadingBlock label="Loading dashboard" />;
  if (dashboard.error) return <ErrorBlock message={dashboard.error} onRetry={dashboard.retry} />;
  const data = dashboard.data;
  if (!data) return null;

  return (
    <>
      <AdminPageHeader title="Dashboard" description="A summary of enquiries received through the website." />

      <section aria-labelledby="totals-heading">
        <h2 id="totals-heading" className="sr-only">Totals</h2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total enquiries', value: data.totals.enquiries },
            { label: 'New', value: data.totals.new },
            { label: 'In progress', value: data.byStatus.IN_PROGRESS },
            { label: 'Closed', value: data.byStatus.CLOSED },
          ].map((tile) => (
            <div key={tile.label} className={cardClass}>
              <dt className="text-sm text-slate">{tile.label}</dt>
              <dd className="mt-2 font-display text-3xl font-bold text-navy">{tile.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section aria-labelledby="status-heading" className={cardClass}>
          <h2 id="status-heading" className="font-display text-lg font-bold text-navy">By status</h2>
          <ul className="mt-4 divide-y divide-line">
            {STATUSES.map((status) => (
              <li key={status} className="flex items-center justify-between py-3 text-sm">
                <span>{STATUS_LABELS[status]}</span>
                <span className="font-semibold text-navy">{data.byStatus[status]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="top-services-heading" className={cardClass}>
          <h2 id="top-services-heading" className="font-display text-lg font-bold text-navy">Most requested services</h2>
          {data.topServices.length === 0 ? (
            <p className="mt-4 text-sm text-slate">Not enough enquiries yet to show a ranking.</p>
          ) : (
            <ol className="mt-4 divide-y divide-line">
              {data.topServices.map((item) => (
                <li key={`${item.serviceId}-${item.name}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0 truncate">{item.name}</span>
                  <span className="font-semibold text-navy">{item.count}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="recent-heading" className={`${cardClass} lg:row-span-1`}>
          <div className="flex items-center justify-between">
            <h2 id="recent-heading" className="font-display text-lg font-bold text-navy">Recent</h2>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-navy underline-offset-4 hover:underline">All enquiries</Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {data.recentEnquiries.length === 0 && <li className="py-3 text-sm text-slate">No enquiries yet.</li>}
            {data.recentEnquiries.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{item.name}</span>
                  <span className="text-xs text-slate">{formatDateTime(item.createdAt)}</span>
                </span>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="recent-table-heading" className="mt-8">
        <h2 id="recent-table-heading" className="mb-4 font-display text-lg font-bold text-navy">Latest enquiries</h2>
        <TableShell caption="Latest enquiries received">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Reference</th>
              <th scope="col" className={thClass}>Name</th>
              <th scope="col" className={thClass}>Service</th>
              <th scope="col" className={thClass}>Status</th>
              <th scope="col" className={thClass}>Received</th>
            </tr>
          </thead>
          <tbody>
            {data.recentEnquiries.map((item) => (
              <tr key={item.id}>
                <td className={`${tdClass} font-mono text-xs`}>{item.referenceCode}</td>
                <td className={tdClass}>{item.name}</td>
                <td className={tdClass}>{item.service?.name ?? 'General enquiry'}</td>
                <td className={tdClass}><StatusBadge status={item.status} /></td>
                <td className={`${tdClass} text-slate`}>{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </section>
    </>
  );
}
