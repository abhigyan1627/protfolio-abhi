import { useState } from 'react';
import { AdminPageHeader, TableShell, ToggleSwitch, tdClass, thClass, FormMessage } from '../../components/admin/AdminPrimitives';
import { ServiceEditor } from '../../components/admin/ServiceEditor';
import { Modal } from '../../components/ui/Modal';
import { ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { buttonClass } from '../../components/ui/styles';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { messageFromError } from '../../lib/errors';
import { CATEGORY_LABELS } from '../../lib/format';
import type { AdminService } from '../../types/api';

export function AdminServicesPage() {
  useDocumentMeta({ title: 'Services | Admin', description: 'Service management.', path: '/admin/services', noindex: true });
  const { session } = useAdminSession();
  const canEdit = session.status === 'authenticated' && session.user.role !== 'VIEWER';
  const services = useAsync((signal) => adminApi.services(signal), []);
  const [editing, setEditing] = useState<AdminService | 'new' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const quickUpdate = async (service: AdminService, patch: Partial<Pick<AdminService, 'enabled' | 'published' | 'featured'>>) => {
    setNotice(null);
    try {
      await adminApi.updateService(service.id, patch);
      services.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The change could not be saved.') });
    }
  };

  const remove = async (service: AdminService) => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    setNotice(null);
    try {
      await adminApi.deleteService(service.id);
      setNotice({ kind: 'success', text: `"${service.name}" was deleted.` });
      services.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The service could not be deleted.') });
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="“Provided” means the practice offers the service. “Visible” controls whether it appears on the website. A service must be both to appear."
        action={canEdit ? <button type="button" onClick={() => setEditing('new')} className={buttonClass('primary')}>Add service</button> : undefined}
      />
      {notice && <div className="mb-6"><FormMessage kind={notice.kind}>{notice.text}</FormMessage></div>}

      {services.loading && <LoadingBlock label="Loading services" />}
      {services.error && <ErrorBlock message={services.error} onRetry={services.retry} />}
      {services.data && (
        <TableShell caption="Services">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Service</th>
              <th scope="col" className={thClass}>Category</th>
              <th scope="col" className={thClass}>Provided</th>
              <th scope="col" className={thClass}>Visible</th>
              <th scope="col" className={thClass}>Featured</th>
              <th scope="col" className={thClass}>Order</th>
              <th scope="col" className={thClass}>Enquiries</th>
              <th scope="col" className={thClass}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {services.data.map((service) => (
              <tr key={service.id}>
                <td className={tdClass}>
                  <span className="font-medium">{service.name}</span>
                  <span className="block font-mono text-xs text-slate">/services/{service.slug}</span>
                </td>
                <td className={tdClass}>{CATEGORY_LABELS[service.category]}</td>
                <td className={tdClass}>
                  <ToggleSwitch label={`Provided: ${service.name}`} checked={service.enabled} disabled={!canEdit} onChange={(next) => quickUpdate(service, { enabled: next })} />
                </td>
                <td className={tdClass}>
                  <ToggleSwitch label={`Visible: ${service.name}`} checked={service.published} disabled={!canEdit} onChange={(next) => quickUpdate(service, { published: next })} />
                </td>
                <td className={tdClass}>
                  <ToggleSwitch label={`Featured: ${service.name}`} checked={service.featured} disabled={!canEdit} onChange={(next) => quickUpdate(service, { featured: next })} />
                </td>
                <td className={tdClass}>{service.displayOrder}</td>
                <td className={tdClass}>{service._count?.enquiries ?? 0}</td>
                <td className={`${tdClass} whitespace-nowrap text-right`}>
                  <button type="button" onClick={() => setEditing(service)} className={buttonClass('secondary', '', 'sm')}>
                    {canEdit ? 'Edit' : 'View'}<span className="sr-only"> {service.name}</span>
                  </button>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => remove(service)}
                      className={buttonClass('danger', 'ml-2', 'sm')}
                    >
                      Delete<span className="sr-only"> {service.name}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}

      <Modal
        title={editing === 'new' ? 'Add a service' : 'Edit service'}
        open={editing !== null}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <ServiceEditor
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              setNotice({ kind: 'success', text: 'Service saved.' });
              services.retry();
            }}
          />
        )}
      </Modal>
    </>
  );
}
