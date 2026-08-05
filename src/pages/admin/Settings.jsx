import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import GeneralSettings from '../../components/settings/GeneralSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import { generalSettings as generalSettingsData, notificationSettings as notificationSettingsData } from '../../data/settingsData';

const Settings = () => {
  const [general, setGeneral] = useState(generalSettingsData);
  const [notifications, setNotifications] = useState(notificationSettingsData);

  const saveGeneralSettings = (values) => {
    setGeneral({ companyName: values.companyName.trim(), companyEmail: values.companyEmail.trim(), companyPhone: values.companyPhone.trim(), companyAddress: values.companyAddress.trim() });
    toast.success('General settings saved successfully.');
  };

  const saveNotificationSettings = (values) => {
    setNotifications({ emailNotifications: values.emailNotifications, leaveNotifications: values.leaveNotifications, announcementNotifications: values.announcementNotifications });
    toast.success('Notification settings saved successfully.');
  };

  const updatePassword = () => {
    toast.success('Password updated successfully.');
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">Settings</h1>
          <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb"><Link className="font-medium text-[#4a45e9] hover:underline" to="/admin/dashboard">Dashboard</Link><ChevronRight size={14} className="text-[#98a2b3]" /><span className="text-[#344767]">Settings</span></nav>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <GeneralSettings settings={general} isOpen onSave={saveGeneralSettings} />
        <NotificationSettings settings={notifications} isOpen onSave={saveNotificationSettings} />
        <SecuritySettings isOpen onSave={updatePassword} />
      </div>

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Settings;
