import { useState } from 'react';
import { KeyRound, Lock, Monitor, Shield, Smartphone } from 'lucide-react';
import Toggle from '../settings/Toggle';
import PasswordField from '../settings/PasswordField';

const activeSessions = [
  { id: 1, device: 'Windows PC • Chrome Browser', location: 'New Delhi, India (Current Session)', ip: '103.21.124.5', icon: Monitor, current: true },
  { id: 2, device: 'iPhone 14 Pro • EMS App', location: 'New Delhi, India', ip: '103.21.124.12', icon: Smartphone, current: false },
];

const SecurityTab = ({ onPasswordChange }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [twoFactor, setTwoFactor] = useState(true);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('New password and confirmation do not match.');
      return;
    }
    if (onPasswordChange) {
      onPasswordChange(passwords);
    }
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <KeyRound size={18} className="text-[#4f46e5]" /> Update Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <PasswordField
            id="current-password"
            label="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            placeholder="••••••••"
            required
          />

          <PasswordField
            id="new-password"
            label="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
            placeholder="••••••••"
            required
          />

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="••••••••"
            required
          />

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#3730a3)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
            >
              <Lock size={16} /> Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication & Security Settings */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <Shield size={18} className="text-[#14a65a]" /> Security Preferences
        </h2>

        <div className="flex items-center justify-between py-3 border-b border-[#edf2f7]">
          <div>
            <p className="text-sm font-semibold text-[#101828]">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-[#64748b]">Add an extra layer of security to your employee account.</p>
          </div>
          <Toggle checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} label="Enable 2FA" />
        </div>
      </div>

      {/* Active Login Sessions Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <Monitor size={18} className="text-[#3b2ee8]" /> Active Sessions
        </h2>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between rounded-xl border border-[#edf2f7] bg-[#f8fafc] p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[#3b2ee8] border border-[#e2e8f0]">
                  <session.icon size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0f172a]">{session.device}</p>
                    {session.current && (
                      <span className="rounded-full bg-[#e5f8ed] px-2 py-0.5 text-[10px] font-bold text-[#14a65a]">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b]">{session.location} • IP: {session.ip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
