import { useState } from 'react';
import { AdminPageHeader, TableShell, ToggleSwitch, tdClass, thClass, FormMessage } from '../../components/admin/AdminPrimitives';
import { ResourceEditor } from '../../components/admin/ResourceEditor';
import { Modal } from '../../components/ui/Modal';
import { ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { buttonClass } from '../../components/ui/styles';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { messageFromError } from '../../lib/errors';
import { formatDate } from '../../lib/format';
import type { AdminResource } from '../../types/api';

export function AdminResourcesPage() {
  useDocumentMeta({ title: 'Resources | Admin', description: 'Article management.', path: '/admin/resources', noindex: true });
  const { session } = useAdminSession();
  const canEdit = session.status === 'authenticated' && session.user.role !== 'VIEWER';
  const resources = useAsync((signal) => adminApi.resources(signal), []);
  const [editing, setEditing] = useState<AdminResource | 'new' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const togglePublished = async (article: AdminResource, published: boolean) => {
    setNotice(null);
    try {
      await adminApi.updateResource(article.id, { published });
      resources.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The change could not be saved.') });
    }
  };

  const remove = async (article: AdminResource) => {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setNotice(null);
    try {
      await adminApi.deleteResource(article.id);
      setNotice({ kind: 'success', text: 'Article deleted.' });
      resources.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The article could not be deleted.') });
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Resources"
        description="Guides shown in the Resources section. Include the publication date and a reminder to verify current rules. The first publish sets the publication date."
        action={canEdit ? <button type="button" onClick={() => setEditing('new')} className={buttonClass('primary')}>New article</button> : undefined}
      />
      {notice && <div className="mb-6"><FormMessage kind={notice.kind}>{notice.text}</FormMessage></div>}

      {resources.loading && <LoadingBlock label="Loading articles" />}
      {resources.error && <ErrorBlock message={resources.error} onRetry={resources.retry} />}
      {resources.data && (
        <TableShell caption="Resources and articles">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Title</th>
              <th scope="col" className={thClass}>Category</th>
              <th scope="col" className={thClass}>Published on</th>
              <th scope="col" className={thClass}>Last updated</th>
              <th scope="col" className={thClass}>Live</th>
              <th scope="col" className={thClass}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {resources.data.map((article) => (
              <tr key={article.id}>
                <td className={tdClass}>
                  <span className="font-medium">{article.title}</span>
                  <span className="block font-mono text-xs text-slate">/resources/{article.slug}</span>
                </td>
                <td className={tdClass}>{article.category}</td>
                <td className={tdClass}>{formatDate(article.publishedAt) || '—'}</td>
                <td className={tdClass}>{formatDate(article.updatedAt)}</td>
                <td className={tdClass}>
                  <ToggleSwitch label={`Publish: ${article.title}`} checked={article.published} disabled={!canEdit} onChange={(next) => togglePublished(article, next)} />
                </td>
                <td className={`${tdClass} whitespace-nowrap text-right`}>
                  <button type="button" onClick={() => setEditing(article)} className={buttonClass('secondary', '', 'sm')}>
                    {canEdit ? 'Edit' : 'View'}<span className="sr-only"> {article.title}</span>
                  </button>
                  {canEdit && (
                    <button type="button" onClick={() => remove(article)} className={buttonClass('danger', 'ml-2', 'sm')}>
                      Delete<span className="sr-only"> {article.title}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}

      <Modal title={editing === 'new' ? 'New article' : 'Edit article'} open={editing !== null} onClose={() => setEditing(null)}>
        {editing !== null && (
          <ResourceEditor
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              setNotice({ kind: 'success', text: 'Article saved.' });
              resources.retry();
            }}
          />
        )}
      </Modal>
    </>
  );
}
