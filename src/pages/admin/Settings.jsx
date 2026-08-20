import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import GeneralSettings from '../../components/settings/GeneralSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import { generalSettings as generalSettingsData, notificationSettings as notificationSettingsData } from '../../data/settingsData';
import { changePassword } from '../../services/authService.js';
import { getSettings, updateSettings } from '../../services/settingsService.js';
import { getApiError } from '../../utils/apiError.js';

const Settings = () => {
  const [general, setGeneral] = useState(generalSettingsData);
  const [notifications, setNotifications] = useState(notificationSettingsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setGeneral({ companyName: settings.companyName, companyEmail: settings.companyEmail, companyPhone: settings.companyPhone, companyAddress: settings.companyAddress });
        setNotifications({ emailNotifications: settings.emailNotifications, leaveNotifications: settings.leaveNotifications, announcementNotifications: settings.announcementNotifications });
      })
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  const saveGeneralSettings = async (values) => {
    try {
      const settings = await updateSettings({ ...general, ...notifications, companyName: values.companyName.trim(), companyEmail: values.companyEmail.trim(), companyPhone: values.companyPhone.trim(), companyAddress: values.companyAddress.trim() });
      setGeneral({ companyName: settings.companyName, companyEmail: settings.companyEmail, companyPhone: settings.companyPhone, companyAddress: settings.companyAddress });
      setNotifications({ emailNotifications: settings.emailNotifications, leaveNotifications: settings.leaveNotifications, announcementNotifications: settings.announcementNotifications });
      toast.success('General settings saved successfully.');
    } catch (error) {
      toast.error(getApiError(error));
      throw error;
    }
  };

  const saveNotificationSettings = async (values) => {
    try {
      const settings = await updateSettings({ ...general, ...notifications, ...values });
      setGeneral({ companyName: settings.companyName, companyEmail: settings.companyEmail, companyPhone: settings.companyPhone, companyAddress: settings.companyAddress });
      setNotifications({ emailNotifications: settings.emailNotifications, leaveNotifications: settings.leaveNotifications, announcementNotifications: settings.announcementNotifications });
      toast.success('Notification settings saved successfully.');
    } catch (error) {
      toast.error(getApiError(error));
      throw error;
    }
  };

  const updatePassword = async (values) => {
    try {
      await changePassword(values);
      toast.success('Password updated successfully.');
    } catch (error) {
      toast.error(getApiError(error));
      throw error;
    }
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
        <GeneralSettings settings={general} isOpen={!loading} onSave={saveGeneralSettings} />
        <NotificationSettings settings={notifications} isOpen={!loading} onSave={saveNotificationSettings} />
        <SecuritySettings isOpen={!loading} onSave={updatePassword} />
      </div>

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Settings;
