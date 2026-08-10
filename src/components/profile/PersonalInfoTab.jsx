import { useState } from 'react';
import { Phone, Save, User } from 'lucide-react';
import { toast } from 'react-toastify';

const countryCodes = [
  { code: '+91', country: 'India', label: '+91 (India)' },
  { code: '+1', country: 'United States', label: '+1 (US)' },
  { code: '+44', country: 'United Kingdom', label: '+44 (UK)' },
  { code: '+61', country: 'Australia', label: '+61 (AU)' },
  { code: '+971', country: 'UAE', label: '+971 (UAE)' },
  { code: '+49', country: 'Germany', label: '+49 (DE)' },
  { code: '+33', country: 'France', label: '+33 (FR)' },
  { code: '+81', country: 'Japan', label: '+81 (JP)' },
  { code: '+65', country: 'Singapore', label: '+65 (SG)' },
  { code: '+86', country: 'China', label: '+86 (CN)' },
  { code: '+966', country: 'Saudi Arabia', label: '+966 (SA)' },
  { code: '+60', country: 'Malaysia', label: '+60 (MY)' },
  { code: '+977', country: 'Nepal', label: '+977 (NP)' },
  { code: '+880', country: 'Bangladesh', label: '+880 (BD)' },
];

const parsePhone = (phoneStr) => {
  if (!phoneStr) return { code: '+91', number: '' };
  const matched = countryCodes.find((c) => phoneStr.startsWith(c.code));
  if (matched) {
    return { code: matched.code, number: phoneStr.slice(matched.code.length).trim() };
  }
  return { code: '+91', number: phoneStr.trim() };
};

const PersonalInfoTab = ({ profile, onSave }) => {
  const initialPhone = parsePhone(profile.phone);
  const initialEmergencyPhone = parsePhone(profile.emergencyContact?.phone);

  const [phoneCode, setPhoneCode] = useState(initialPhone.code);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);

  const [emergencyCode, setEmergencyCode] = useState(initialEmergencyPhone.code);
  const [emergencyNumber, setEmergencyNumber] = useState(initialEmergencyPhone.number);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    gender: profile.gender || 'Male',
    dateOfBirth: profile.dateOfBirth || '',
    address: profile.address || '',
    emergencyName: profile.emergencyContact?.name || '',
    emergencyRelation: profile.emergencyContact?.relation || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      toast.error('Mobile number must contain at least 10 digits.');
      return;
    }

    if (emergencyNumber && emergencyNumber.trim()) {
      const emergencyDigits = emergencyNumber.replace(/\D/g, '');
      if (emergencyDigits.length < 10) {
        toast.error('Emergency contact mobile number must contain at least 10 digits.');
        return;
      }
    }

    const payload = {
      ...formData,
      phone: `${phoneCode} ${phoneNumber.trim()}`,
      emergencyPhone: emergencyNumber.trim() ? `${emergencyCode} ${emergencyNumber.trim()}` : '',
    };

    if (onSave) {
      onSave(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primary Details Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <User size={18} className="text-[#4f46e5]" /> Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Phone Number</label>
            <div className="flex rounded-lg border border-[#dce3ee] bg-white transition focus-within:border-[#4f46e5] overflow-hidden">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="w-[105px] border-r border-[#dce3ee] bg-[#f8fafc] px-2.5 py-2.5 text-xs font-semibold text-[#101828] outline-none cursor-pointer hover:bg-slate-100 shrink-0"
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none placeholder:text-[#94a3b8]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#344767] mb-1">Residential Address</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <Phone size={18} className="text-[#14a65a]" /> Emergency Contact
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Contact Name</label>
            <input
              type="text"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Relationship</label>
            <input
              type="text"
              name="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Contact Phone</label>
            <div className="flex rounded-lg border border-[#dce3ee] bg-white transition focus-within:border-[#4f46e5] overflow-hidden">
              <select
                value={emergencyCode}
                onChange={(e) => setEmergencyCode(e.target.value)}
                className="w-[105px] border-r border-[#dce3ee] bg-[#f8fafc] px-2.5 py-2.5 text-xs font-semibold text-[#101828] outline-none cursor-pointer hover:bg-slate-100 shrink-0"
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={emergencyNumber}
                onChange={(e) => setEmergencyNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#3730a3)] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:opacity-95"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoTab;
