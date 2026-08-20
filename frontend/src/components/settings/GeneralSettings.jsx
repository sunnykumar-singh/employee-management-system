import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const fieldClassName = 'mt-1.5 w-full rounded-md border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6659f5] focus:ring-2 focus:ring-[#ecebff]';

const Field = ({ label, children }) => <label className="block text-sm font-medium text-[#344767]">{label}{children}</label>;
const ErrorMessage = ({ error }) => error ? <p className="mt-1.5 text-xs text-[#f04438]">{error.message}</p> : null;

const GeneralSettings = ({ settings, isOpen, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { companyName: '', companyEmail: '', companyPhone: '', companyAddress: '' } });

  useEffect(() => {
    if (!isOpen) return;
    reset({ companyName: settings.companyName, companyEmail: settings.companyEmail, companyPhone: settings.companyPhone, companyAddress: settings.companyAddress });
  }, [isOpen, reset, settings]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-[16px] font-bold text-[#101828]">General Settings</h2>
      <p className="mt-1 text-xs text-[#667085]">Update your company information below.</p>

      <form className="mt-5 flex flex-1 flex-col gap-4 sm:grid sm:grid-cols-2" onSubmit={handleSubmit(onSave)} noValidate>
        <Field label="Company Name"><input className={fieldClassName} placeholder="Acme Corporation" {...register('companyName', { required: 'Company Name is required.' })} /><ErrorMessage error={errors.companyName} /></Field>
        <Field label="Company Email"><input className={fieldClassName} type="email" placeholder="contact@company.com" {...register('companyEmail', { required: 'Company Email is required.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} /><ErrorMessage error={errors.companyEmail} /></Field>
        <Field label="Company Phone"><input className={fieldClassName} inputMode="numeric" placeholder="+91 98765 43210" {...register('companyPhone', { required: 'Company Phone is required.', validate: (value) => /^[+\d\s-]{7,}$/.test(value.trim()) || 'Enter a valid phone number.' })} /><ErrorMessage error={errors.companyPhone} /></Field>
        <div className="sm:col-span-2"><Field label="Company Address"><textarea className={`${fieldClassName} min-h-24 resize-y`} placeholder="Enter company address" {...register('companyAddress', { required: 'Company Address is required.' })} /></Field><ErrorMessage error={errors.companyAddress} /></div>
        <div className="mt-auto flex justify-end pt-4 sm:col-span-2"><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>Save Changes</button></div>
      </form>
    </section>
  );
};

export default GeneralSettings;
