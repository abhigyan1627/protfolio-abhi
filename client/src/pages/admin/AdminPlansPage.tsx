import { useState } from 'react';
import { AdminPageHeader, TableShell, ToggleSwitch, tdClass, thClass, FormMessage } from '../../components/admin/AdminPrimitives';
import { PlanEditor } from '../../components/admin/PlanEditor';
import { Modal } from '../../components/ui/Modal';
import { ErrorBlock, LoadingBlock } from '../../components/ui/States';
import { buttonClass } from '../../components/ui/styles';
import { useAdminSession } from '../../hooks/AdminSessionProvider';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { adminApi } from '../../lib/adminApi';
import { messageFromError } from '../../lib/errors';
import { AUDIENCE_LABELS, CATEGORY_LABELS, formatPlanPrice } from '../../lib/format';
import type { AdminPlan } from '../../types/api';

export function AdminPlansPage() {
  useDocumentMeta({ title: 'Plans | Admin', description: 'Plan and pricing management.', path: '/admin/plans', noindex: true });
  const { session } = useAdminSession();
  const canEdit = session.status === 'authenticated' && session.user.role !== 'VIEWER';
  const plans = useAsync((signal) => adminApi.plans(signal), []);
  const [editing, setEditing] = useState<AdminPlan | 'new' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const quickUpdate = async (plan: AdminPlan, patch: Partial<Pick<AdminPlan, 'published' | 'featured'>>) => {
    setNotice(null);
    try {
      await adminApi.updatePlan(plan.id, patch);
      plans.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The change could not be saved.') });
    }
  };

  const remove = async (plan: AdminPlan) => {
    if (!window.confirm(`Delete the plan "${plan.name}"? This cannot be undone.`)) return;
    setNotice(null);
    try {
      await adminApi.deletePlan(plan.id);
      setNotice({ kind: 'success', text: `"${plan.name}" was deleted.` });
      plans.retry();
    } catch (error) {
      setNotice({ kind: 'error', text: messageFromError(error, 'The plan could not be deleted.') });
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Plans and pricing"
        description="Leave the price blank to show “Contact for Quotation”. Prices are stored in paise and shown in rupees. Only enter prices you have approved."
        action={canEdit ? <button type="button" onClick={() => setEditing('new')} className={buttonClass('primary')}>Add plan</button> : undefined}
      />
      {notice && <div className="mb-6"><FormMessage kind={notice.kind}>{notice.text}</FormMessage></div>}

      {plans.loading && <LoadingBlock label="Loading plans" />}
      {plans.error && <ErrorBlock message={plans.error} onRetry={plans.retry} />}
      {plans.data && (
        <TableShell caption="Plans">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Plan</th>
              <th scope="col" className={thClass}>Customer</th>
              <th scope="col" className={thClass}>Category</th>
              <th scope="col" className={thClass}>Price</th>
              <th scope="col" className={thClass}>Visible</th>
              <th scope="col" className={thClass}>Featured</th>
              <th scope="col" className={thClass}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {plans.data.map((plan) => {
              const price = formatPlanPrice(plan);
              return (
                <tr key={plan.id}>
                  <td className={tdClass}>
                    <span className="font-medium">{plan.name}</span>
                    <span className="block font-mono text-xs text-slate">{plan.slug}</span>
                  </td>
                  <td className={tdClass}>{AUDIENCE_LABELS[plan.audience]}</td>
                  <td className={tdClass}>{CATEGORY_LABELS[plan.serviceCategory]}</td>
                  <td className={tdClass}>{price.isQuote ? 'Quotation' : `${price.headline}${price.suffix ? ` ${price.suffix}` : ''}`}</td>
                  <td className={tdClass}>
                    <ToggleSwitch label={`Visible: ${plan.name}`} checked={plan.published} disabled={!canEdit} onChange={(next) => quickUpdate(plan, { published: next })} />
                  </td>
                  <td className={tdClass}>
                    <ToggleSwitch label={`Featured: ${plan.name}`} checked={plan.featured} disabled={!canEdit} onChange={(next) => quickUpdate(plan, { featured: next })} />
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-right`}>
                    <button type="button" onClick={() => setEditing(plan)} className={buttonClass('secondary', '', 'sm')}>
                      {canEdit ? 'Edit' : 'View'}<span className="sr-only"> {plan.name}</span>
                    </button>
                    {canEdit && (
                      <button type="button" onClick={() => remove(plan)} className={buttonClass('danger', 'ml-2', 'sm')}>
                        Delete<span className="sr-only"> {plan.name}</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      )}

      <Modal title={editing === 'new' ? 'Add a plan' : 'Edit plan'} open={editing !== null} onClose={() => setEditing(null)}>
        {editing !== null && (
          <PlanEditor
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              setNotice({ kind: 'success', text: 'Plan saved.' });
              plans.retry();
            }}
          />
        )}
      </Modal>
    </>
  );
}
