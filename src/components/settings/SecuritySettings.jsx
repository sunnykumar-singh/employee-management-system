import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PasswordField from './PasswordField';

const SecuritySettings = ({ isOpen, onSave }) => {
  const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting } } = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  useEffect(() => {
    if (!isOpen) return;
    reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-[16px] font-bold text-[#101828]">Security Settings</h2>
      <p className="mt-1 text-xs text-[#667085]">Update your account password to keep your account secure.</p>

      <form className="mt-5 flex flex-1 flex-col gap-4 sm:grid sm:grid-cols-2" onSubmit={handleSubmit(onSave)} noValidate>
        <PasswordField label="Current Password" placeholder="Enter current password" error={errors.currentPassword} register={register('currentPassword', { required: 'Current Password is required.' })} />
        <PasswordField label="New Password" placeholder="Enter new password" error={errors.newPassword} register={register('newPassword', { required: 'New Password is required.', minLength: { value: 8, message: 'Password must be at least 8 characters.' } })} />
        <div className="sm:col-span-2"><PasswordField label="Confirm Password" placeholder="Confirm new password" error={errors.confirmPassword} register={register('confirmPassword', { required: 'Please confirm your new password.', validate: (value) => value === getValues('newPassword') || 'Passwords do not match.' })} /></div>
        <div className="mt-auto flex justify-end pt-4 sm:col-span-2"><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>Update Password</button></div>
      </form>
    </section>
  );
};

export default SecuritySettings;
