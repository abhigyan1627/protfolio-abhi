import { useState, type FormEvent } from 'react';
import { AdminPageHeader, Pagination, StatusBadge, TableShell, tdClass, thClass, FormMessage } from '../../components/admin/AdminPrimitives';
import { Modal } from '../../components/ui/Modal';
import { Field, SelectInput, TextArea, TextInput } from '../../components/ui/FormControls';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { buttonClass, cardClass } from '../../components/ui/styles';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { messageFromError } from '../../lib/errors';
import { CONTACT_LABELS, formatDateTime, STATUS_LABELS } from '../../lib/format';
import type { EnquiryDetail, EnquiryStatus } from '../../types/api';

const STATUS_OPTIONS: EnquiryStatus[] = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];

export function AdminEnquiriesPage() {
  useDocumentMeta({ title: 'Enquiries | Admin', description: 'Enquiry management.', path: '/admin/enquiries', noindex: true });
  const { session } = useAdminSession();
  const canEdit = session.status === 'authenticated' && session.user.role !== 'VIEWER';

  const [status, setStatus] = useState<EnquiryStatus | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useAsync((signal) => adminApi.enquiries({ status, q: query, page }, signal), [status, query, page]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  };

  return (
    <>
      <AdminPageHeader title="Enquiries" description="Enquiries are stored securely and visible only to signed-in staff. Search by name or reference code." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <form onSubmit={submitSearch} className="flex flex-1 flex-col gap-3 sm:flex-row" role="search">
          <div className="flex-1">
            <label htmlFor="enq-search" className="mb-1.5 block text-sm font-medium">Search</label>
            <TextInput id="enq-search" type="search" placeholder="Name or reference, e.g. CMA-2601-…" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          </div>
          <button type="submit" className={buttonClass('secondary')}>Search</button>
        </form>
        <div className="sm:w-56">
          <label htmlFor="enq-status" className="mb-1.5 block text-sm font-medium">Status</label>
          <SelectInput
            id="enq-status"
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as EnquiryStatus | '');
            }}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>{STATUS_LABELS[item]}</option>
            ))}
          </SelectInput>
        </div>
      </div>

      {list.loading && <LoadingBlock label="Loading enquiries" />}
      {list.error && <ErrorBlock message={list.error} onRetry={list.retry} />}
      {list.data && list.data.items.length === 0 && (
        <EmptyBlock title="No enquiries match these filters" description="Try a different status or search term." />
      )}
      {list.data && list.data.items.length > 0 && (
        <>
          <TableShell caption="Enquiries">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Reference</th>
                <th scope="col" className={thClass}>Name</th>
                <th scope="col" className={thClass}>Contact</th>
                <th scope="col" className={thClass}>Interest</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={thClass}>Received</th>
                <th scope="col" className={thClass}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.data.items.map((item) => (
                <tr key={item.id}>
                  <td className={`${tdClass} font-mono text-xs`}>{item.referenceCode}</td>
                  <td className={tdClass}>{item.name}</td>
                  <td className={`${tdClass} text-slate`}>
                    {item.phone ?? item.email ?? '—'}
                    <span className="block text-xs">{CONTACT_LABELS[item.contactMethod]}</span>
                  </td>
                  <td className={tdClass}>{item.plan?.name ?? item.service?.name ?? 'General enquiry'}</td>
                  <td className={tdClass}><StatusBadge status={item.status} /></td>
                  <td className={`${tdClass} whitespace-nowrap text-slate`}>{formatDateTime(item.createdAt)}</td>
                  <td className={`${tdClass} text-right`}>
                    <button type="button" onClick={() => setOpenId(item.id)} className={buttonClass('secondary', '', 'sm')}>
                      {canEdit ? 'Open' : 'View'}<span className="sr-only"> enquiry {item.referenceCode}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pagination page={list.data.page} totalPages={list.data.totalPages} onChange={setPage} />
        </>
      )}

      <Modal title="Enquiry details" open={openId !== null} onClose={() => setOpenId(null)}>
        {openId && <EnquiryDetailView id={openId} canEdit={canEdit} onSaved={list.retry} />}
      </Modal>
    </>
  );
}

function EnquiryDetailView({ id, canEdit, onSaved }: { id: string; canEdit: boolean; onSaved: () => void }) {
  const detail = useAsync((signal) => adminApi.enquiry(id, signal), [id]);
  const [status, setStatus] = useState<EnquiryStatus | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  if (detail.loading) return <LoadingBlock label="Loading enquiry" />;
  if (detail.error) return <ErrorBlock message={detail.error} onRetry={detail.retry} />;
  const item: EnquiryDetail | undefined = detail.data;
  if (!item) return null;

  const currentStatus = status ?? item.status;
  const currentNote = note ?? item.internalNote ?? '';

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await adminApi.updateEnquiry(item.id, { status: currentStatus, internalNote: currentNote.trim() || null });
      setMessage({ kind: 'success', text: 'Enquiry updated.' });
      detail.retry();
      onSaved();
    } catch (error) {
      setMessage({ kind: 'error', text: messageFromError(error, 'The enquiry could not be updated.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div><dt className="text-slate">Reference</dt><dd className="mt-1 font-mono font-semibold">{item.referenceCode}</dd></div>
        <div><dt className="text-slate">Received</dt><dd className="mt-1">{formatDateTime(item.createdAt)}</dd></div>
        <div><dt className="text-slate">Name</dt><dd className="mt-1 font-semibold">{item.name}</dd></div>
        <div><dt className="text-slate">Preferred contact</dt><dd className="mt-1">{CONTACT_LABELS[item.contactMethod]}</dd></div>
        <div><dt className="text-slate">Phone</dt><dd className="mt-1">{item.phone ?? '—'}</dd></div>
        <div><dt className="text-slate">Email</dt><dd className="mt-1 break-all">{item.email ?? '—'}</dd></div>
        <div><dt className="text-slate">Service</dt><dd className="mt-1">{item.service?.name ?? 'General enquiry'}</dd></div>
        <div><dt className="text-slate">Plan</dt><dd className="mt-1">{item.plan?.name ?? '—'}</dd></div>
      </dl>

      <div className={`${cardClass} p-5`}>
        <p className="text-slate">Message</p>
        <p className="mt-2 whitespace-pre-wrap text-ink">{item.message ?? 'No message was included.'}</p>
        <p className="mt-4 text-xs text-slate">Privacy notice accepted on {formatDateTime(item.consentedAt)}.</p>
      </div>

      {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="enq-detail-status" label="Status">
          <SelectInput id="enq-detail-status" value={currentStatus} disabled={!canEdit} onChange={(event) => setStatus(event.target.value as EnquiryStatus)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{STATUS_LABELS[option]}</option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field id="enq-detail-note" label="Internal follow-up note" hint="Visible to staff only. Not shown to the enquirer.">
        <TextArea id="enq-detail-note" rows={4} value={currentNote} disabled={!canEdit} onChange={(event) => setNote(event.target.value)} />
      </Field>

      {canEdit && (
        <div className="flex justify-end">
          <button type="button" onClick={save} disabled={saving} className={buttonClass('primary')}>
            {saving ? 'Saving…' : 'Save update'}
          </button>
        </div>
      )}
    </div>
  );
}
