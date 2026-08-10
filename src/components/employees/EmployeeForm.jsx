import { Upload, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { filterOptions } from '../../data/employeesData.js';

const fieldClassName = 'mt-1.5 w-full rounded-md border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6659f5] focus:ring-2 focus:ring-[#ecebff]';

const ErrorMessage = ({ error }) => error ? <p className="mt-1.5 text-xs text-[#f04438]">{error.message}</p> : null;

const Field = ({ label, children }) => (
  <label className="block text-sm font-medium text-[#344767]">
    {label}
    {children}
  </label>
);

const toInputDate = (date) => {
  if (!date) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parsedDate = new Date(`${date} 12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
};

const EmployeeForm = ({ employee, employees, isOpen, mode = 'add', onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { employeeId: '', fullName: '', email: '', phone: '', department: '', designation: '', joiningDate: '', status: '', gender: '' } });

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!isOpen) return;
    reset(isEditMode && employee ? {
      employeeId: employee.employeeId,
      fullName: employee.name,
      email: employee.email,
      phone: employee.phone.replace(/\D/g, '').slice(-10),
      department: employee.department,
      designation: employee.designation,
      joiningDate: toInputDate(employee.joinDate),
      status: employee.status,
      gender: employee.gender,
      profilePhoto: null,
    } : { employeeId: '', fullName: '', email: '', phone: '', department: '', designation: '', joiningDate: '', status: '', gender: '', profilePhoto: null });
  }, [employee, isEditMode, isOpen, reset]);

  if (!isOpen) return null;

  const closeForm = () => {
    reset();
    onClose();
  };

  const submitForm = (values) => onSubmit(values);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
      <div className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl shadow-slate-900/25">
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4 sm:px-6">
          <div><h2 id="employee-form-title" className="text-lg font-bold text-[#101828]">{isEditMode ? 'Edit Employee' : 'Add Employee'}</h2><p className="mt-1 text-xs text-[#667085]">{isEditMode ? 'Update the employee details below.' : 'Enter the employee details below.'}</p></div>
          <button className="rounded-md p-2 text-[#667085] transition hover:bg-slate-100 hover:text-[#101828]" type="button" onClick={closeForm} aria-label="Close form"><X size={20} /></button>
        </div>
        <form className="p-5 sm:p-6" onSubmit={handleSubmit(submitForm)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Employee ID" error={errors.employeeId}><input className={`${fieldClassName} ${isEditMode ? 'cursor-not-allowed bg-[#f8fafc] text-[#667085]' : ''}`} placeholder="EMP009" readOnly={isEditMode} {...register('employeeId', { required: 'Employee ID is required.', validate: (value) => !employees.some((currentEmployee) => currentEmployee.employeeId.toLowerCase() === value.trim().toLowerCase() && currentEmployee.employeeId !== employee?.employeeId) || 'This Employee ID already exists.' })} /><ErrorMessage error={errors.employeeId} /></Field>
            <Field label="Full Name" error={errors.fullName}><input className={fieldClassName} placeholder="Enter full name" {...register('fullName', { required: 'Full Name is required.', validate: (value) => value.trim().length > 0 || 'Full Name cannot be empty.' })} /><ErrorMessage error={errors.fullName} /></Field>
            <Field label="Email" error={errors.email}><input className={fieldClassName} type="email" placeholder="name@company.com" {...register('email', { required: 'Email is required.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} /><ErrorMessage error={errors.email} /></Field>
            <Field label="Phone Number" error={errors.phone}>
              <div className="mt-1.5 flex rounded-md border border-[#dfe6f0] bg-white transition focus-within:border-[#6659f5] focus-within:ring-2 focus-within:ring-[#ecebff] overflow-hidden">
                <select className="w-[105px] border-r border-[#dfe6f0] bg-[#f8fafc] px-2.5 py-2 text-xs font-semibold text-[#101828] outline-none cursor-pointer hover:bg-slate-100 shrink-0" defaultValue="+91">
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+49">+49 (DE)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+81">+81 (JP)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+86">+86 (CN)</option>
                </select>
                <input className="w-full bg-white px-3 py-2 text-sm text-[#101828] outline-none" inputMode="numeric" placeholder="10-digit mobile number" {...register('phone', { required: 'Phone Number is required.', pattern: { value: /^\d{10}$/, message: 'Phone Number must contain exactly 10 digits.' } })} />
              </div>
              <ErrorMessage error={errors.phone} />
            </Field>
            <Field label="Department" error={errors.department}><select className={fieldClassName} {...register('department', { required: 'Please select a department.' })}><option value="">Select department</option>{filterOptions.departments.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.department} /></Field>
            <Field label="Designation" error={errors.designation}><select className={fieldClassName} {...register('designation', { required: 'Please select a designation.' })}><option value="">Select designation</option>{filterOptions.designations.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.designation} /></Field>
            <Field label="Joining Date" error={errors.joiningDate}><input className={fieldClassName} type="date" {...register('joiningDate', { required: 'Joining Date is required.' })} /><ErrorMessage error={errors.joiningDate} /></Field>
            <Field label="Status" error={errors.status}><select className={fieldClassName} {...register('status', { required: 'Please select a status.' })}><option value="">Select status</option>{filterOptions.statuses.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.status} /></Field>
            <fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-[#344767]">Gender</legend><div className="mt-2 flex flex-wrap gap-5">{['Male', 'Female', 'Other'].map((gender) => <label className="flex items-center gap-2 text-sm text-[#344767]" key={gender}><input className="size-4 accent-[#4b3df2]" type="radio" value={gender} {...register('gender', { required: 'Please select a gender.' })} />{gender}</label>)}</div><ErrorMessage error={errors.gender} /></fieldset>
            <Field label="Profile Photo" error={errors.profilePhoto}><label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cfd8e6] bg-[#fafbff] px-3 py-5 text-sm text-[#667085] transition hover:border-[#6659f5] hover:bg-[#f5f4ff]"><Upload size={18} />Upload profile photo<input className="sr-only" type="file" accept="image/*" {...register('profilePhoto')} /></label></Field>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-[#e7edf5] pt-5"><button className="rounded-md border border-[#dfe6f0] px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50" type="button" onClick={closeForm}>Cancel</button><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isEditMode ? 'Update Employee' : 'Add Employee'}</button></div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
