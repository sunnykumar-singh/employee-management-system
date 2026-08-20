import { UserRound, X } from 'lucide-react';
import EmployeeStatusBadge from './EmployeeStatusBadge.jsx';

const DetailItem = ({ label, value }) => (
  <div className="rounded-lg border border-[#e7edf5] bg-[#fbfcfe] px-3 py-2.5">
    <p className="text-[10px] font-medium uppercase tracking-wide text-[#667085]">{label}</p>
    <p className="mt-1 text-sm font-medium text-[#101828]">{value || 'Not specified'}</p>
  </div>
);

const EmployeeDetailsModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="employee-details-title">
      <section className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl shadow-slate-900/25">
        <header className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4 sm:px-6">
          <h2 id="employee-details-title" className="text-lg font-bold text-[#101828]">Employee Details</h2>
          <button className="rounded-md p-2 text-[#667085] transition hover:bg-slate-100 hover:text-[#101828]" type="button" onClick={onClose} aria-label="Close employee details"><X size={20} /></button>
        </header>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center gap-4 border-b border-[#e7edf5] pb-5 text-center sm:flex-row sm:text-left">
            {employee.profilePhoto ? <img className="size-20 rounded-full object-cover" src={employee.profilePhoto} alt={`${employee.name} profile`} /> : <span className="flex size-20 items-center justify-center rounded-full bg-[#ecebff] text-[#4b3df2]"><UserRound size={38} /></span>}
            <div><h3 className="text-xl font-bold text-[#101828]">{employee.name}</h3><p className="mt-1 text-sm text-[#667085]">{employee.employeeId}</p><div className="mt-2"><EmployeeStatusBadge status={employee.status} /></div></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Employee ID" value={employee.employeeId} />
            <DetailItem label="Full Name" value={employee.name} />
            <DetailItem label="Email" value={employee.email} />
            <DetailItem label="Phone" value={employee.phone} />
            <DetailItem label="Department" value={employee.department} />
            <DetailItem label="Designation" value={employee.designation} />
            <DetailItem label="Joining Date" value={employee.joinDate} />
            <DetailItem label="Gender" value={employee.gender} />
          </div>
        </div>
        <footer className="flex justify-end border-t border-[#e7edf5] px-5 py-4 sm:px-6"><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4032e8]" type="button" onClick={onClose}>Close</button></footer>
      </section>
    </div>
  );
};

export default EmployeeDetailsModal;
