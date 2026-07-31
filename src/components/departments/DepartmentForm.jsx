import { Upload, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const fieldClassName = 'mt-1.5 w-full rounded-md border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6659f5] focus:ring-2 focus:ring-[#ecebff]';

const Field = ({ label, children }) => <label className="block text-sm font-medium text-[#344767]">{label}{children}</label>;
const ErrorMessage = ({ error }) => error ? <p className="mt-1.5 text-xs text-[#f04438]">{error.message}</p> : null;

const DepartmentForm = ({ department, departmentId, departments, isOpen, mode = 'add', onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { departmentId: '', departmentName: '', departmentHead: '', description: '', status: 'Active', headPhoto: null } });
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!isOpen) return;
    reset(isEditMode && department ? { departmentId: department.departmentId, departmentName: department.name, departmentHead: department.head, description: department.description, status: department.status, headPhoto: null } : { departmentId, departmentName: '', departmentHead: '', description: '', status: 'Active', headPhoto: null });
  }, [department, isEditMode, isOpen, reset]);

  if (!isOpen) return null;

  const closeForm = () => { reset(); onClose(); };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="department-form-title">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl shadow-slate-900/25">
        <header className="flex items-center justify-between border-b border-[#e7edf5] px-5 py-4 sm:px-6"><div><h2 id="department-form-title" className="text-lg font-bold text-[#101828]">{isEditMode ? 'Edit Department' : 'Add Department'}</h2><p className="mt-1 text-xs text-[#667085]">{isEditMode ? 'Update the department details below.' : 'Enter the department details below.'}</p></div><button className="rounded-md p-2 text-[#667085] transition hover:bg-slate-100 hover:text-[#101828]" type="button" onClick={closeForm} aria-label="Close form"><X size={20} /></button></header>
        <form className="p-5 sm:p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department ID"><input className={fieldClassName} placeholder="DEP009" {...register('departmentId', { required: 'Department ID is required.', validate: (value) => !departments.some((currentDepartment) => currentDepartment.departmentId.toLowerCase() === value.trim().toLowerCase() && currentDepartment.departmentId !== department?.departmentId) || 'This Department ID already exists.' })} /><ErrorMessage error={errors.departmentId} /></Field>
            <Field label="Department Name"><input className={fieldClassName} placeholder="Enter department name" {...register('departmentName', { required: 'Department Name is required.', validate: (value) => value.trim().length > 0 || 'Department Name cannot be empty.' })} /><ErrorMessage error={errors.departmentName} /></Field>
            <Field label="Department Head"><input className={fieldClassName} placeholder="Enter department head name" {...register('departmentHead', { required: 'Department Head is required.', validate: (value) => value.trim().length > 0 || 'Department Head cannot be empty.' })} /><ErrorMessage error={errors.departmentHead} /></Field>
            <Field label="Status"><select className={fieldClassName} {...register('status', { required: 'Please select a status.' })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select><ErrorMessage error={errors.status} /></Field>
            <div className="sm:col-span-2"><Field label="Department Head Photo"><label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cfd8e6] bg-[#fafbff] px-3 py-4 text-sm text-[#667085] transition hover:border-[#6659f5] hover:bg-[#f5f4ff]"><Upload size={18} />Upload department head photo<input className="sr-only" type="file" accept="image/*" {...register('headPhoto')} /></label></Field><p className="mt-1.5 text-xs text-[#667085]">Optional. PNG, JPG, or WEBP image.</p></div>
            <div className="sm:col-span-2"><Field label="Description"><textarea className={`${fieldClassName} min-h-28 resize-y`} placeholder="Enter department description" {...register('description', { required: 'Description is required.', validate: (value) => value.trim().length > 0 || 'Description cannot be empty.' })} /></Field><ErrorMessage error={errors.description} /></div>
          </div>
          <footer className="mt-6 flex justify-end gap-3 border-t border-[#e7edf5] pt-5"><button className="rounded-md border border-[#dfe6f0] px-4 py-2.5 text-sm font-medium text-[#344767] transition hover:bg-slate-50" type="button" onClick={closeForm}>Cancel</button><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isEditMode ? 'Update Department' : 'Add Department'}</button></footer>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
