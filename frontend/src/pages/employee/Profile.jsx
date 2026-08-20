import { useState } from 'react';
import { Briefcase, ChevronRight, KeyRound, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import ProfileHeader from '../../components/profile/ProfileHeader';
import PersonalInfoTab from '../../components/profile/PersonalInfoTab';
import OrganizationTab from '../../components/profile/OrganizationTab';
import SecurityTab from '../../components/profile/SecurityTab';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import { useAuth } from '../../context/AuthContext.jsx';
import { employeeProfileData } from '../../data/profileData';
import { notificationSettings as notificationSettingsData } from '../../data/settingsData';
import { changePassword, updateProfile, uploadProfilePhoto } from '../../services/authService.js';
import { getApiError } from '../../utils/apiError.js';

const Profile = () => {
  const { user, updateSession, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    ...employeeProfileData,
    id: user?.id || employeeProfileData.id,
    name: user?.fullName || employeeProfileData.name,
    email: user?.email || employeeProfileData.email,
    role: user?.role || employeeProfileData.role,
    initials: (user?.fullName || 'JD').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    profilePhoto: user?.profilePhoto || null,
    phone: user?.phone || employeeProfileData.phone,
    gender: user?.gender || employeeProfileData.gender,
    dateOfBirth: user?.dateOfBirth || employeeProfileData.dateOfBirth,
    address: user?.address || employeeProfileData.address,
    emergencyContact: {
      name: user?.emergencyName || employeeProfileData.emergencyContact?.name || '',
      relation: user?.emergencyRelation || employeeProfileData.emergencyContact?.relation || '',
      phone: user?.emergencyPhone || employeeProfileData.emergencyContact?.phone || '',
    },
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [notifications, setNotifications] = useState(notificationSettingsData);

  const handleAvatarChange = async (file) => {
    setUploadingAvatar(true);
    try {
      const updatedUser = await uploadProfilePhoto(file);
      updateUser(updatedUser);
      setProfile((prev) => ({ ...prev, profilePhoto: updatedUser.profilePhoto }));
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(getApiError(error));
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSavePersonalInfo = async (updatedData) => {
    try {
      const session = await updateProfile({
        fullName: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        gender: updatedData.gender,
        dateOfBirth: updatedData.dateOfBirth || null,
        address: updatedData.address,
        emergencyName: updatedData.emergencyName,
        emergencyRelation: updatedData.emergencyRelation,
        emergencyPhone: updatedData.emergencyPhone,
      });
      updateSession(session);
      setProfile((prev) => ({
        ...prev,
        name: session.user.fullName,
        initials: session.user.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
        email: session.user.email,
        phone: session.user.phone,
        gender: session.user.gender,
        dateOfBirth: session.user.dateOfBirth || '',
        address: session.user.address,
        emergencyContact: {
          name: session.user.emergencyName,
          relation: session.user.emergencyRelation,
          phone: session.user.emergencyPhone,
        },
      }));
      toast.success('Personal profile updated successfully!');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handlePasswordChange = async (passwords) => {
    try {
      await changePassword({
        currentPassword: passwords.current || passwords.currentPassword,
        newPassword: passwords.new || passwords.newPassword,
      });
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error(getApiError(error));
      throw error;
    }
  };

  const saveNotificationSettings = async (values) => {
    setNotifications(values);
    toast.success('Notification settings saved successfully.');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'organization', label: 'Job & Organization', icon: Briefcase },
    { id: 'security', label: 'Security & Password', icon: KeyRound },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">My Profile</h1>
          <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb">
            <Link className="font-medium text-[#4f46e5] hover:underline" to="/employee/dashboard">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-[#98a2b3]" />
            <span className="text-[#344767]">Profile</span>
          </nav>
        </div>
      </header>

      <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} uploading={uploadingAvatar} />

      <div className="flex border-b border-[#e2e8f0] bg-white rounded-xl px-2 pt-2 shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-[#4338ca] text-[#4338ca]'
                  : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
              type="button"
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'personal' && (
          <PersonalInfoTab profile={profile} onSave={handleSavePersonalInfo} />
        )}
        {activeTab === 'organization' && (
          <OrganizationTab profile={profile} />
        )}
        {activeTab === 'security' && (
          <SecurityTab onPasswordChange={handlePasswordChange} />
        )}
        {activeTab === 'settings' && (
          <div className="grid gap-5 xl:grid-cols-2">
            <NotificationSettings settings={notifications} isOpen onSave={saveNotificationSettings} />
            <SecuritySettings isOpen onSave={handlePasswordChange} />
          </div>
        )}
      </div>

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Profile;
