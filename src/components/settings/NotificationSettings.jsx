import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Toggle from './Toggle';

const NotificationSettings = ({ settings, isOpen, onSave }) => {
  const { handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({ defaultValues: { emailNotifications: false, leaveNotifications: false, announcementNotifications: false } });

  useEffect(() => {
    if (!isOpen) return;
    reset({ emailNotifications: settings.emailNotifications, leaveNotifications: settings.leaveNotifications, announcementNotifications: settings.announcementNotifications });
  }, [isOpen, reset, settings]);

  if (!isOpen) return null;

  const toggles = [
    { name: 'emailNotifications', label: 'Email', description: 'Receive emails about company updates and reminders.' },
    { name: 'leaveNotifications', label: 'Leave', description: 'Get notified when a leave request is submitted or approved.' },
    { name: 'announcementNotifications', label: 'Announcements', description: 'Receive alerts whenever a new announcement is published.' },
  ];

  return (
    <section className="flex flex-col rounded-xl border border-[#e7edf5] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-[16px] font-bold text-[#101828]">Notification Settings</h2>
      <p className="mt-1 text-xs text-[#667085]">Choose which notifications you want to receive.</p>

      <form className="mt-5 flex flex-1 flex-col" onSubmit={handleSubmit(onSave)}>
        <div className="flex-1 divide-y divide-[#e7edf5]">
          {toggles.map((toggle) => (
            <div className="flex items-center justify-between gap-4 py-4" key={toggle.name}>
              <div>
                <p className="text-sm font-medium text-[#344767]">{toggle.label}</p>
                <p className="mt-0.5 text-xs text-[#667085]">{toggle.description}</p>
              </div>
              <Toggle
                checked={watch(toggle.name)}
                label={toggle.label}
                onChange={(value) => setValue(toggle.name, value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-auto flex justify-end border-t border-[#e7edf5] pt-5"><button className="rounded-md bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-300 transition hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>Save Changes</button></div>
      </form>
    </section>
  );
};

export default NotificationSettings;
