import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmationModal = ({ employee, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-employee-title">
      <section className="w-full max-w-md rounded-xl bg-white shadow-2xl shadow-slate-900/25">
        <header className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4">
          <h2 id="delete-employee-title" className="text-lg font-bold text-[#101828]">Delete Employee</h2>
          <button className="rounded-md p-2 text-[#667085] transition hover:bg-slate-100 hover:text-[#101828]" type="button" onClick={onClose} aria-label="Close delete confirmation"><X size={20} /></button>
        </header>
        <div className="px-5 py-6 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#ffebeb] text-[#f04438]"><AlertTriangle size={28} /></span>
          <p className="mt-4 text-base font-semibold text-[#101828]">Delete this employee?</p>
          <p className="mt-2 text-sm leading-6 text-[#667085]">You are about to delete <span className="font-semibold text-[#344767]">{employee.name}</span> ({employee.employeeId}). This action cannot be undone.</p>
        </div>
        <footer className="flex justify-end gap-3 border-t border-[#e7edf5] px-5 py-4">
          <button className="rounded-md border border-[#dfe6f0] px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50" type="button" onClick={onClose}>Cancel</button>
          <button className="flex items-center gap-2 rounded-md bg-[#f04438] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92d20]" type="button" onClick={onConfirm}><Trash2 size={16} />Delete</button>
        </footer>
      </section>
    </div>
  );
};

export default DeleteConfirmationModal;
