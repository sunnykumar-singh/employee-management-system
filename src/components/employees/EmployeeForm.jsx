import { Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { filterOptions } from '../../data/employeesData.js';

const fieldClassName = 'mt-1.5 w-full rounded-md border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6659f5] focus:ring-2 focus:ring-[#ecebff]';

const ErrorMessage = ({ error }) => error ? <p className="mt-1.5 text-xs text-[#f04438]">{error.message}</p> : null;

const Field = ({ label, children }) => (
  <label className="block text-sm font-medium text-[#344767]">
    {label}
    {children}
  </label>
);

const EmployeeForm = ({ employees, isOpen, onAddEmployee, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { employeeId: '', fullName: '', email: '', phone: '', department: '', designation: '', joiningDate: '', status: '', gender: '' } });

  if (!isOpen) return null;

  const closeForm = () => {
    reset();
    onClose();
  };

  const onSubmit = (values) => {
    const nextId = employees.reduce((largestId, employee) => Math.max(largestId, employee.id), 0) + 1;
    const formattedJoinDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${values.joiningDate}T00:00:00`));
    const initials = values.fullName.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase();

    onAddEmployee({
      id: nextId,
      employeeId: values.employeeId.trim() || `EMP${String(nextId).padStart(3, '0')}`,
      name: values.fullName.trim(),
      initials,
      email: values.email.trim(),
      phone: values.phone,
      department: values.department,
      designation: values.designation,
      status: values.status,
      gender: values.gender,
      joinDate: formattedJoinDate,
      isNewJoiner: true,
      avatar: '#6659f5',
    });
    toast.success('Employee added successfully.');
    closeForm();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
      <div className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl shadow-slate-900/25">
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4 sm:px-6">
          <div><h2 id="employee-form-title" className="text-lg font-bold text-[#101828]">Add Employee</h2><p className="mt-1 text-xs text-[#667085]">Enter the employee details below.</p></div>
          <button className="rounded-md p-2 text-[#667085] transition hover:bg-slate-100 hover:text-[#101828]" type="button" onClick={closeForm} aria-label="Close form"><X size={20} /></button>
        </div>
        <form className="p-5 sm:p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Employee ID" error={errors.employeeId}><input className={fieldClassName} placeholder="EMP009" {...register('employeeId', { required: 'Employee ID is required.', validate: (value) => !employees.some((employee) => employee.employeeId.toLowerCase() === value.trim().toLowerCase()) || 'This Employee ID already exists.' })} /><ErrorMessage error={errors.employeeId} /></Field>
            <Field label="Full Name" error={errors.fullName}><input className={fieldClassName} placeholder="Enter full name" {...register('fullName', { required: 'Full Name is required.', validate: (value) => value.trim().length > 0 || 'Full Name cannot be empty.' })} /><ErrorMessage error={errors.fullName} /></Field>
            <Field label="Email" error={errors.email}><input className={fieldClassName} type="email" placeholder="name@company.com" {...register('email', { required: 'Email is required.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} /><ErrorMessage error={errors.email} /></Field>
            <Field label="Phone Number" error={errors.phone}><input className={fieldClassName} inputMode="numeric" placeholder="10-digit mobile number" {...register('phone', { required: 'Phone Number is required.', pattern: { value: /^\d{10}$/, message: 'Phone Number must contain exactly 10 digits.' } })} /><ErrorMessage error={errors.phone} /></Field>
            <Field label="Department" error={errors.department}><select className={fieldClassName} {...register('department', { required: 'Please select a department.' })}><option value="">Select department</option>{filterOptions.departments.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.department} /></Field>
            <Field label="Designation" error={errors.designation}><select className={fieldClassName} {...register('designation', { required: 'Please select a designation.' })}><option value="">Select designation</option>{filterOptions.designations.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.designation} /></Field>
            <Field label="Joining Date" error={errors.joiningDate}><input className={fieldClassName} type="date" {...register('joiningDate', { required: 'Joining Date is required.' })} /><ErrorMessage error={errors.joiningDate} /></Field>
            <Field label="Status" error={errors.status}><select className={fieldClassName} {...register('status', { required: 'Please select a status.' })}><option value="">Select status</option>{filterOptions.statuses.slice(1).map((option) => <option key={option}>{option}</option>)}</select><ErrorMessage error={errors.status} /></Field>
            <fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-[#344767]">Gender</legend><div className="mt-2 flex flex-wrap gap-5">{['Male', 'Female', 'Other'].map((gender) => <label className="flex items-center gap-2 text-sm text-[#344767]" key={gender}><input className="size-4 accent-[#4b3df2]" type="radio" value={gender} {...register('gender', { required: 'Please select a gender.' })} />{gender}</label>)}</div><ErrorMessage error={errors.gender} /></fieldset>
            <Field label="Profile Photo" error={errors.profilePhoto}><label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cfd8e6] bg-[#fafbff] px-3 py-5 text-sm text-[#667085] transition hover:border-[#6659f5] hover:bg-[#f5f4ff]"><Upload size={18} />Upload profile photo<input className="sr-only" type="file" accept="image/*" {...register('profilePhoto')} /></label></Field>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-[#e7edf5] pt-5"><button className="rounded-md border border-[#dfe6f0] px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50" type="button" onClick={closeForm}>Cancel</button><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>Save Employee</button></div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
