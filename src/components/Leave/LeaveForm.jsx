import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const LeaveForm = ({ leave, isOpen, onClose, onSave, mode = 'edit' }) => {
  const isCreate = mode === 'create';
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { leaveType: '', from: '', to: '', reason: '' } });

  useEffect(() => {
    if (!isOpen) return;
    if (isCreate) {
      reset({ leaveType: 'Casual', from: '', to: '', reason: '' });
      return;
    }
    if (!leave) return;
    reset({ leaveType: leave.leaveType, from: leave.fromDate || leave.from, to: leave.toDate || leave.to, reason: leave.reason });
  }, [isOpen, isCreate, leave, reset]);

  if (!isOpen || (!isCreate && !leave)) return null;

  const closeForm = () => {
    reset();
    onClose();
  };

  const submitForm = (values) => onSave(isCreate ? values : { ...leave, ...values });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-6 py-4">
          <h2 className="text-xl font-bold text-[#101828]">{isCreate ? 'Apply Leave' : 'Edit Leave'}</h2>
          <button onClick={closeForm} className="rounded-md p-2 transition hover:bg-slate-100" type="button" aria-label="Close leave form"><X size={20} /></button>
        </div>

        <form className="space-y-5 p-6" onSubmit={handleSubmit(submitForm)} noValidate>
          <div className="grid grid-cols-2 gap-5">
            {!isCreate && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#344767]">Employee</label>
                <input type="text" value={leave.employee} disabled className="w-full rounded-lg border border-[#d0d5dd] bg-slate-100 px-4 py-2.5 text-sm" />
              </div>
            )}

            <div className={isCreate ? 'col-span-2 sm:col-span-1' : ''}>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Leave Type</label>
              <select className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm" {...register('leaveType', { required: true })}>
                <option>Casual</option>
                <option>Sick</option>
                <option>Annual</option>
                <option>Emergency</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">From Date</label>
              <input type="date" className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm" {...register('from', { required: true })} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">To Date</label>
              <input type="date" className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm" {...register('to', { required: true })} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344767]">Reason</label>
            <textarea rows={4} className="w-full resize-none rounded-lg border border-[#d0d5dd] px-4 py-3 text-sm" {...register('reason', { required: true })} />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#e7edf5] pt-5">
            <button type="button" onClick={closeForm} className="rounded-lg border border-[#d0d5dd] px-5 py-2.5 text-sm font-medium text-[#344767] hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#4b3df2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60">
              {isCreate ? 'Submit Request' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
