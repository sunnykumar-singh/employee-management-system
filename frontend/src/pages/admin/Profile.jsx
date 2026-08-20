import { useState } from 'react';
import { Briefcase, ChevronRight, KeyRound, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import ProfileHeader from '../../components/profile/ProfileHeader';
import PersonalInfoTab from '../../components/profile/PersonalInfoTab';
import OrganizationTab from '../../components/profile/OrganizationTab';
import SecurityTab from '../../components/profile/SecurityTab';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminProfileData } from '../../data/profileData';
import { updateProfile, uploadProfilePhoto } from '../../services/authService.js';
import { getApiError } from '../../utils/apiError.js';

const Profile = () => {
  const { user, updateSession, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    ...adminProfileData,
    id: user?.id || adminProfileData.id,
    name: user?.fullName || adminProfileData.name,
    email: user?.email || adminProfileData.email,
    role: user?.role === 'ADMIN' ? 'Super Admin' : user?.role || adminProfileData.role,
    initials: (user?.fullName || 'AU').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    profilePhoto: user?.profilePhoto || null,
    phone: user?.phone || adminProfileData.phone,
    gender: user?.gender || adminProfileData.gender,
    dateOfBirth: user?.dateOfBirth || adminProfileData.dateOfBirth,
    address: user?.address || adminProfileData.address,
    emergencyContact: {
      name: user?.emergencyName || adminProfileData.emergencyContact?.name || '',
      relation: user?.emergencyRelation || adminProfileData.emergencyContact?.relation || '',
      phone: user?.emergencyPhone || adminProfileData.emergencyContact?.phone || '',
    },
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const handlePasswordChange = () => {
    toast.success('Password updated successfully!');
  };

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

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'organization', label: 'Job & Organization', icon: Briefcase },
    { id: 'security', label: 'Security & Password', icon: KeyRound },
  ];

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Page Header & Breadcrumbs */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-none tracking-tight text-[#101828]">My Profile</h1>
          <nav className="mt-2 flex items-center gap-1 text-[12px]" aria-label="Breadcrumb">
            <Link className="font-medium text-[#4f46e5] hover:underline" to="/admin/dashboard">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-[#98a2b3]" />
            <span className="text-[#344767]">Profile</span>
          </nav>
        </div>
      </header>

      {/* Top Banner Card */}
      <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} uploading={uploadingAvatar} />

      {/* Navigation Tabs */}
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

      {/* Tab Contents */}
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
      </div>

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Profile;
