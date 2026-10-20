import { useState } from 'react';
import { AdminPageHeader, TableShell, ToggleSwitch, tdClass, thClass, FormMessage } from '../../components/admin/AdminPrimitives';
import { FaqEditor } from '../../components/admin/FaqEditor';
import { SettingsForm } from '../../components/admin/SettingsForm';
import { Modal } from '../../components/ui/Modal';
import { ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { buttonClass } from '../../components/ui/styles';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { messageFromError } from '../../lib/errors';
import { FAQ_SCOPE_LABELS } from '../../lib/format';
import type { AdminFaq, AdminSettings } from '../../types/api';

export function AdminSettingsPage() {
  useDocumentMeta({ title: 'Settings | Admin', description: 'Website settings.', path: '/admin/settings', noindex: true });
  const { session } = useAdminSession();
  const isOwner = session.status === 'authenticated' && session.user.role === 'OWNER';
  const canEditContent = session.status === 'authenticated' && session.user.role !== 'VIEWER';

  const settings = useAsync((signal) => adminApi.settings(signal), []);
  const faqs = useAsync((signal) => adminApi.faqs(signal), []);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | 'new' | null>(null);
  const [faqNotice, setFaqNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [current, setCurrent] = useState<AdminSettings | null>(null);

  const loaded = current ?? settings.data ?? null;

  const toggleFaq = async (faq: AdminFaq, published: boolean) => {
    setFaqNotice(null);
    try {
      await adminApi.updateFaq(faq.id, { published });
      faqs.retry();
    } catch (error) {
      setFaqNotice({ kind: 'error', text: messageFromError(error, 'The change could not be saved.') });
    }
  };

  const removeFaq = async (faq: AdminFaq) => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    try {
      await adminApi.deleteFaq(faq.id);
      setFaqNotice({ kind: 'success', text: 'Question deleted.' });
      faqs.retry();
    } catch (error) {
      setFaqNotice({ kind: 'error', text: messageFromError(error, 'The question could not be deleted.') });
    }
  };

  return (
    <>
      <AdminPageHeader title="Website settings" description="Contact details, links and approved branding. Changes appear on the website after saving." />

      {settings.loading && <LoadingBlock label="Loading settings" />}
      {settings.error && <ErrorBlock message={settings.error} onRetry={settings.retry} />}
      {loaded && <SettingsForm settings={loaded} canEdit={isOwner} onSaved={setCurrent} />}

      <section aria-labelledby="faq-admin-heading" className="mt-16">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="faq-admin-heading" className="font-display text-2xl font-bold text-navy">Frequently asked questions</h2>
            <p className="mt-2 text-sm text-slate">Shown on the website only when published.</p>
          </div>
          {canEditContent && (
            <button type="button" onClick={() => setEditingFaq('new')} className={buttonClass('primary')}>
              Add question
            </button>
          )}
        </div>
        {faqNotice && <div className="mb-6"><FormMessage kind={faqNotice.kind}>{faqNotice.text}</FormMessage></div>}
        {faqs.loading && <LoadingBlock label="Loading questions" />}
        {faqs.error && <ErrorBlock message={faqs.error} onRetry={faqs.retry} />}
        {faqs.data && (
          <TableShell caption="Frequently asked questions">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Question</th>
                <th scope="col" className={thClass}>Shown on</th>
                <th scope="col" className={thClass}>Order</th>
                <th scope="col" className={thClass}>Published</th>
                <th scope="col" className={thClass}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {faqs.data.map((faq) => (
                <tr key={faq.id}>
                  <td className={`${tdClass} max-w-md`}>{faq.question}</td>
                  <td className={tdClass}>{FAQ_SCOPE_LABELS[faq.scope]}</td>
                  <td className={tdClass}>{faq.displayOrder}</td>
                  <td className={tdClass}>
                    <ToggleSwitch label={`Publish: ${faq.question}`} checked={faq.published} disabled={!canEditContent} onChange={(next) => toggleFaq(faq, next)} />
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-right`}>
                    <button type="button" onClick={() => setEditingFaq(faq)} className={buttonClass('secondary', '', 'sm')} disabled={!canEditContent}>
                      Edit<span className="sr-only"> question</span>
                    </button>
                    {canEditContent && (
                      <button type="button" onClick={() => removeFaq(faq)} className={buttonClass('danger', 'ml-2', 'sm')}>
                        Delete<span className="sr-only"> question</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </section>

      <Modal title={editingFaq === 'new' ? 'Add a question' : 'Edit question'} open={editingFaq !== null} onClose={() => setEditingFaq(null)}>
        {editingFaq !== null && (
          <FaqEditor
            initial={editingFaq === 'new' ? undefined : editingFaq}
            onCancel={() => setEditingFaq(null)}
            onSaved={() => {
              setEditingFaq(null);
              setFaqNotice({ kind: 'success', text: 'Question saved.' });
              faqs.retry();
            }}
          />
        )}
      </Modal>
    </>
  );
}
